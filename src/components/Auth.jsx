export default function Auth({children}) {
    return (
        <main className="auth">
            <section className="auth_content">
                <h1>Guestspot app</h1>
                {children}
            </section>
        </main>
    )
}