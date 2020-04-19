import { Op } from 'sequelize';
import {
  startOfWeek,
  setHours,
  setMinutes,
  isBefore,
  isAfter,
  isToday,
} from 'date-fns';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Recipient from '../models/Recipient';

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
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: ['name', 'street', 'number', 'city', 'state', 'cep'],
          },
        ],
        attributes: ['id', 'product', 'start_date', 'end_date', 'recipient_id'],
        order: ['id'],
      });
      return res.json(deliveries);
    }
    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        end_date: null,
        canceled_at: null,
      },
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'street', 'number', 'city', 'state', 'cep'],
        },
      ],
      attributes: ['id', 'product', 'start_date', 'end_date', 'recipient_id'],
      order: ['id'],
    });
    return res.json(deliveries);
  }

  async update(req, res) {
    const { id: deliveryman_id } = req.params;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    const { q: delivery_id } = req.query;

    const delivery = await Delivery.findOne({
      where: { id: delivery_id },
      attributes: ['id', 'product', 'end_date', 'canceled_at', 'start_date'],
    });

    if (!delivery) {
      return res.status(400).json({ error: "Delivery don't exists" });
    }

    if (delivery.end_date !== null) {
      return res.status(400).json({ error: 'Delivery was delivered' });
    }

    if (delivery.canceled_at !== null) {
      return res.status(400).json({ error: 'Delivery was canceled' });
    }

    // If signature_id is sending in the body
    const { signature_id } = req.body;

    if (signature_id) {
      if (delivery.start_date === null) {
        return res.status(400).json({ error: 'Delivery was not retrieved' });
      }

      const end_date = new Date();

      await delivery.update({
        end_date,
        signature_id,
      });
      return res.json({
        sucess: 'Delivery finished',
      });
    }

    if (delivery.start_date !== null) {
      return res.status(400).json({ error: 'Delivery was already retrieved' });
    }

    const today = new Date();

    const startOfTheWeek = startOfWeek(today);

    const deliverymanRetrieves = await Delivery.findAll({
      where: { deliveryman_id, start_date: { [Op.gte]: startOfTheWeek } },
    });

    let retrievesToday = 0;

    const start_date = new Date();
    const availableStartTime = setHours(setMinutes(start_date, 0), 8);
    const availableEndTime = setHours(setMinutes(start_date, 0), 18);

    if (
      isBefore(start_date, availableStartTime) ||
      isAfter(start_date, availableEndTime)
    ) {
      return res
        .status(401)
        .json({ error: "Retrieves can't happen at this hour" });
    }

    deliverymanRetrieves.forEach(checkin => {
      if (isToday(checkin.createdAt)) {
        retrievesToday += 1;
      }
    });

    if (retrievesToday >= 5) {
      return res.status(400).json({
        error: 'The deliveryman has already made five retrieves today',
      });
    }
    await delivery.update(
      {
        start_date: today,
      },
      { where: { id: delivery_id } }
    );

    return res.json({
      success: 'Delivery retrieved',
    });
  }
}

export default new DeliveriesController();
