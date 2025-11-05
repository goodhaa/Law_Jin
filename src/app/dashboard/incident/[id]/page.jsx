import { CONFIG } from 'src/global-config';
import { _invoices } from 'src/_mock/_invoice';

import { InvoiceDetailsView } from 'src/sections/invoice/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Invoice details | Dashboard - ${CONFIG.appName}` };

export default async function Page({ params }) {
  const { id } = await params;

  const currentInvoice = _invoices.find((invoice) => invoice.id === id);

  return <InvoiceDetailsView invoice={currentInvoice} />;
}

export async function generateStaticParams() {
  const data = CONFIG.isStaticExport ? _invoices : _invoices.slice(0, 1);

  return data.map((invoice) => ({
    id: invoice.id,
  }));
}
