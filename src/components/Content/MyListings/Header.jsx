export default function Header({children}) {
    return (
        <div className="app-content-header">
          <div>
            {children}
          </div>
          <span>+</span>
        </div>
    )
}