// This is a simple pass-through layout as the page itself handles auth check and redirect
export default function ProfileLayout({ children }: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}