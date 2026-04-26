import { Router, raw } from 'express';
import { AuthRequest, verifyToken } from '../middleware/auth';
import {
  createCheckoutSession,
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  verifyWebhookSignature,
} from '../services/stripe.service';
import { AppError } from '../middleware/error-handler';

export const billingRoutes = Router();

// Create checkout session
billingRoutes.post('/checkout', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const { plan } = req.body;

    if (!['pro', 'plus'].includes(plan)) {
      const error: AppError = new Error('Invalid plan');
      error.status = 400;
      return next(error);
    }

    const session = await createCheckoutSession(req.userId!, plan);
    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
});

// Webhook for Stripe events
billingRoutes.post(
  '/webhook',
  raw({ type: 'application/json' }),
  async (req, res, next) => {
    try {
      const signature = req.headers['stripe-signature'] as string;
      const event = await verifyWebhookSignature(req.body, signature);

      switch (event.type) {
        case 'customer.subscription.created':
          await handleSubscriptionCreated(event.data.object);
          break;
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object);
          break;
      }

      res.json({ received: true });
    } catch (error) {
      next(error);
    }
  }
);
