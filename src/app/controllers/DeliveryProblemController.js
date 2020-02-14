import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryController {
  async index(req, res) {
    const { id: delivery_id } = req.params;

    if (delivery_id) {
      const deliveryProblem = await DeliveryProblem.findAll({
        attributes: [['id', 'problem_id'], 'description'],
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
}

export default new DeliveryController();
