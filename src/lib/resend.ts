import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface LeadData {
    name: string;
    email: string;
    phone?: string;
    service?: string;
    message?: string;
}

export async function sendLeadNotification(lead: LeadData) {
    const contactEmail = process.env.CONTACT_EMAIL;

    if (!contactEmail || !process.env.RESEND_API_KEY) {
        console.log('E-mail não configurado, pulando envio');
        return null;
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Cred Mais <onboarding@resend.dev>',
            to: [contactEmail],
            subject: `Novo Lead: ${lead.name}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #29577E, #0f2438); padding: 20px; text-align: center;">
            <h1 style="color: #FC4C00; margin: 0;">Novo Contato Recebido!</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #29577E; margin-top: 0;">Dados do Lead:</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Nome:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${lead.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">E-mail:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${lead.email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Telefone:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${lead.phone || 'Não informado'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Serviço:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${lead.service || 'Não informado'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #374151;">Mensagem:</td>
                <td style="padding: 10px; color: #6b7280;">${lead.message || 'Nenhuma mensagem'}</td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding: 15px; background: #FC4C00; border-radius: 8px; text-align: center;">
              <a href="mailto:${lead.email}" style="color: white; text-decoration: none; font-weight: bold;">
                Responder ao Lead
              </a>
            </div>
          </div>
          <div style="padding: 15px; text-align: center; color: #9ca3af; font-size: 12px;">
            Este e-mail foi enviado automaticamente pelo sistema Cred Mais.
          </div>
        </div>
      `,
        });

        if (error) {
            console.error('Erro ao enviar e-mail:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        return null;
    }
}
