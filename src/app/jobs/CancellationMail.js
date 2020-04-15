import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { delivery } = data;

    Mail.sendMail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: 'Entrega cancelada',
      template: 'cancelation',
      context: {
        deliverymanName: delivery.deliveryman.name,
        deliveryId: delivery.id,
        recipientName: delivery.recipient.name,
      },
    });
  }
}

export default new CancellationMail();
