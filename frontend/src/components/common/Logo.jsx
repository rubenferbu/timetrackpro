function Logo({ size = 28, showWordmark = true }) {
    return (
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="var(--color-primary)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="80 100.5"
                    transform="rotate(-90 20 20)"
                />
                <path
                    d="M32 8 L34.5 8.5 L34 11"
                    stroke="var(--color-primary)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
                <path d="M20 20 L20 12" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M20 20 L26 20" stroke="var(--color-secondary)" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="20" cy="20" r="2.2" fill="var(--color-secondary)" />
            </svg>

            {showWordmark && (
                <span style={{ fontWeight: 600, fontSize: 16, color: 'var(--color-text)' }}>
                    TimeTrack <span style={{ color: 'var(--color-primary)' }}>Pro</span>
                </span>
            )}
        </div>
    );
}

export default Logo;