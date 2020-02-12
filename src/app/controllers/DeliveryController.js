import {
  startOfToday,
  getHours,
  setHours,
  setMinutes,
  isBefore,
  isAfter,
} from 'date-fns';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Recipient from '../models/Recipient';

class DeliveryController {
  async index(req, res) {
    const delivery = await Delivery.findAll({
      attributes: [
        'id',
        'product',
        'deliveryman_id',
        'recipient_id',
        'signature_id',
      ],
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(delivery);
  }

  async store(req, res) {
    const { recipient_id, deliveryman_id } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists.' });
    }

    try {
      const delivery = await Delivery.create(req.body);

      return res.json(delivery);
    } catch (err) {
      return res.status(500).json({ error: 'Error creating delivery' });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const delivery = await Deliveryman.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists' });
    }
    // Checking update in recipient or delivery man
    const { recipient_id, deliveryman_id } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists.' });
    }

    const { signature_id } = req.body;

    if (signature_id) {
      const signature = await File.findOne({
        where: {
          id: signature_id,
        },
      });

      if (!signature) {
        return res.status(400).json({ error: 'Signature does not found.' });
      }
    }
    const timeNow = new Date();
    const availableStartTime = setHours(setMinutes(timeNow, 0), 8);
    const availableEndTime = setHours(setMinutes(timeNow, 0), 18);

    if (
      isBefore(timeNow, availableStartTime) ||
      isAfter(timeNow, availableEndTime)
    ) {
      return res
        .status(401)
        .json({ error: "Retrieves can't happen at this hour" });
    }

    await delivery.update(req.body);

    const {
      product,
      start_date,
      end_date,
      canceled_at,
      signature,
    } = await Delivery.findByPk(id);

    return res.json({
      id,
      product,
      start_date,
      end_date,
      canceled_at,
      recipient,
      deliveryman,
      signature,
    });
  }

  async delete(req, res) { }
}

export default new DeliveryController();
