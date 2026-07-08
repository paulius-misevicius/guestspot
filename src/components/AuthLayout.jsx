import { Outlet } from "react-router"

export default function AuthLayout() {
    return (
        <main className="auth">
            <section className="auth_content">
                <h1>Guestspot app</h1>
                <Outlet />
            </section>
        </main>
    )
}