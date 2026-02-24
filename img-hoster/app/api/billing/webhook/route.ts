import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook signature failed" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        if (!userId || !plan) break;

        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: sub.id,
            stripePriceId: sub.items.data[0].price.id,
            plan,
            status: "active",
            currentPeriodStart: new Date((sub as any).current_period_start * 1000),
            currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
          },
          update: {
            stripeSubscriptionId: sub.id,
            stripePriceId: sub.items.data[0].price.id,
            plan,
            status: "active",
            currentPeriodStart: new Date((sub as any).current_period_start * 1000),
            currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
          },
        });

        await prisma.user.update({ where: { id: userId }, data: { plan } });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const sub = await prisma.subscription.findFirst({ where: { stripeCustomerId: customerId } });
        if (!sub) break;

        await prisma.billingHistory.create({
          data: {
            userId: sub.userId,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: "paid",
            description: `Subscription payment - ${sub.plan} plan`,
            invoiceUrl: invoice.hosted_invoice_url || null,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const sub = await prisma.subscription.findFirst({ where: { stripeSubscriptionId: subscription.id } });
        if (!sub) break;

        await prisma.subscription.update({ where: { id: sub.id }, data: { plan: "free", status: "canceled" } });
        await prisma.user.update({ where: { id: sub.userId }, data: { plan: "free" } });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const sub = await prisma.subscription.findFirst({ where: { stripeSubscriptionId: subscription.id } });
        if (!sub) break;

        await prisma.subscription.update({
          where: { id: sub.id },
          data: {
            status: subscription.status,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

