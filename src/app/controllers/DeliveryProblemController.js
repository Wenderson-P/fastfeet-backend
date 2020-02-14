import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryController {
  async index(req, res) {
    const deliveryProblem = await DeliveryProblem.findAll({
      attributes: [['id', 'problem_id'], 'description'],
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: [['id'], 'product'],
        },
      ],
    });

    return res.json(deliveryProblem);
  }
}

export default new DeliveryController();
