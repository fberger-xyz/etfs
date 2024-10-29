import { AppThemes } from '@/enums'

export const colors: Record<'line' | 'text' | 'dztext', Record<AppThemes, string>> = {
    line: { [AppThemes.LIGHT]: '#e4e4e7', [AppThemes.DARK]: '#334155' },
    text: { [AppThemes.LIGHT]: '#6b7280', [AppThemes.DARK]: '#94a3b8' },
    dztext: { [AppThemes.LIGHT]: '#ef4444', [AppThemes.DARK]: '#a7f3d0' },
}
