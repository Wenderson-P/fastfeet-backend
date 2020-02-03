import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class UserController {
  async index(req, res) {
    const deliverymen = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ],
    });

    return res.json(deliverymen);
  }

  async store(req, res) {
    const { avatar_id, email } = req.body;

    const deliverymanExists = await Deliveryman.findOne({
      where: { email },
    });

    if (deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman already exists' });
    }

    const file = await File.findOne({
      where: { id: avatar_id },
    });

    if (!file) {
      return res.status(401).json({ error: 'File does not exists.' });
    }

    const deliveryman = await Deliveryman.create(req.body);

    return res.json(deliveryman);
  }
}

export default new UserController();
