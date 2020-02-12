import { Op } from 'sequelize';
import Delivery from '../models/Delivery';

class DeliveriesController {
  async index(req, res) {
    const { id } = req.params;

    const { q } = req.query;

    if (q === 'ended') {
      const deliveries = await Delivery.findAll({
        where: {
          deliveryman_id: id,
          end_date: { [Op.not]: null },
        },
        attributes: ['id', 'product', 'start_date', 'end_date', 'recipient_id'],
      });
      return res.json(deliveries);
    }
    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        end_date: null,
        canceled_at: null,
      },
      attributes: ['id', 'product', 'start_date', 'end_date', 'recipient_id'],
    });
    return res.json(deliveries);
  }
}

export default new DeliveriesController();
