import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Recipient from '../models/Recipient';

class DeliveryController {
  async index(req, res) { }

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
}

export default new DeliveryController();
