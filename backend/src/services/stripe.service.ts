import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const prisma = new PrismaClient();

export async function createCheckoutSession(userId: string, plan: 'pro' | 'plus') {
  const prices = {
    pro: process.env.STRIPE_PRICE_PRO || 'price_pro',
    plus: process.env.STRIPE_PRICE_PLUS || 'price_plus',
  };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    line_items: [{ price: prices[plan], quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/pricing`,
  });

  return session;
}

export async function handleSubscriptionCreated(stripeSubscription: any) {
  const customerId = stripeSubscription.customer;
  const plan = stripeSubscription.items.data[0].price.lookup_key || 'pro';

  // Find user by stripe customer ID or create
  let subscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!subscription) {
    // New subscription
    const user = await prisma.user.findFirst({
      where: { subscription: { stripeCustomerId: customerId } },
    });

    if (!user) {
      console.error(`User not found for customer ${customerId}`);
      return;
    }

    subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        stripeCustomerId: customerId,
        stripeSubscriptionId: stripeSubscription.id,
        plan,
        status: 'active',
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      },
    });

    // Update user tier
    await prisma.user.update({
      where: { id: user.id },
      data: { subscriptionTier: plan },
    });
  }

  return subscription;
}

export async function handleSubscriptionUpdated(stripeSubscription: any) {
  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: stripeSubscription.id },
  });

  if (!subscription) return;

  const status = stripeSubscription.status === 'active' ? 'active' : 'cancelled';

  return prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status,
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
    },
  });
}

export async function handleSubscriptionDeleted(stripeSubscription: any) {
  return prisma.subscription.update({
    where: { stripeSubscriptionId: stripeSubscription.id },
    data: { status: 'cancelled' },
  });
}

export async function verifyWebhookSignature(body: string, signature: string): Promise<any> {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET || ''
  );
}
