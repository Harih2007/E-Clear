export function Footer() {
    return (
        <footer className="border-t bg-muted/50">
            <div className="container px-4 py-8 md:py-12 max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col items-center md:items-start">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} E-Clear. Promoting sustainable e-waste disposal.
                    </p>
                </div>
                <div className="flex gap-4">
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">Terms</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</a>
                </div>
            </div>
        </footer>
    )
}
