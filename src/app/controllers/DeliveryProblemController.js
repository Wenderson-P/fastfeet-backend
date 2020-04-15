import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import DeliveryProblem from '../models/DeliveryProblem';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class DeliveryProblemController {
  async index(req, res) {
    const { id: delivery_id } = req.params;
    const { page = 1 } = req.query;

    let offset = (page - 1) * 8;

    if (offset <= 0) {
      offset = 0;
    }

    if (delivery_id) {
      const deliveryProblem = await DeliveryProblem.findAll({
        attributes: [['id', 'problem_id'], 'description', 'created_at'],
        include: [
          {
            model: Delivery,
            as: 'delivery',
            attributes: ['id', 'product'],
          },
        ],
        where: {
          delivery_id,
        },
        limit: 8,
        offset,
        order: ['id'],
      });
      return res.json(deliveryProblem);
    }

    const deliveryProblem = await DeliveryProblem.findAll({
      attributes: ['id', 'description'],
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['id', 'product'],
        },
      ],
      limit: 8,
      offset,
    });

    return res.json(deliveryProblem);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { id: delivery_id } = req.params;

    const delivery = await Delivery.findByPk(delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists' });
    }
    try {
      const { description } = req.body;
      const deliveryProblem = await DeliveryProblem.create({
        delivery_id,
        description,
      });
      return res.json(deliveryProblem);
    } catch (error) {
      return res.status(500).json({
        error: 'It was not possible to register the problem',
      });
    }
  }

  async update(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name'],
        },
      ],
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists.' });
    }

    await delivery.update(
      { canceled_at: new Date() },
      {
        where: {
          id,
        },
      }
    );
    await Queue.add(CancellationMail.key, {
      delivery,
    });
    return res.json('Delivery was canceled');
  }
}

export default new DeliveryProblemController();
