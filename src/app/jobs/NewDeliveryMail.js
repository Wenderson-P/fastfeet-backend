import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }

  async handle({ data }) {
    const { deliveryman, delivery, recipient } = data;
    Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Nova entrega para ser retirada',
      text: 'Existe uma nova entrega para você retirar',
      template: 'newDelivery',
      context: {
        deliverymanName: deliveryman.name,
        deliveryId: delivery.id,
        recipientName: recipient.name,
        recipientCity: recipient.city,
        recipientStreet: recipient.street,
      },
    });
  }
}

export default new NewDeliveryMail();
