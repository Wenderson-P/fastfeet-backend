import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      cep: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { name, cep } = req.body;

    const recipientExists = await Recipient.findOne({ where: { name, cep } });

    if (recipientExists) {
      return res.status(401).json({ error: 'Recipient already exists' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json({ recipient });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.number(),
      complement: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      cep: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(401).json({ error: 'The recipient does not exists' });
    }

    const { name } = req.body;

    if (recipient.name !== name) {
      const recipientExists = await Recipient.findOne({
        where: { name },
      });

      if (recipientExists) {
        return res.status(401).json({ error: 'This name is already taken' });
      }
    }

    const { address, number, state, city, cep } = await recipient.update(
      req.body,
      { where: { id } }
    );

    return res.json({
      name,
      address,
      number,
      state,
      city,
      cep,
    });
  }
}

export default new RecipientController();