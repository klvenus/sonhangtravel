import BlogForm from '../BlogForm';

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BlogForm postId={id} />;
}
