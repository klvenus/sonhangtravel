import TourForm from '../TourForm';
export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TourForm tourId={id} />;
}
