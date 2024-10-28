import { AppThemes } from '@/enums'

export const colors: Record<'line' | 'text', Record<AppThemes, string>> = {
    line: { [AppThemes.LIGHT]: '#e4e4e7', [AppThemes.DARK]: '#475569' },
    text: { [AppThemes.LIGHT]: '#6b7280', [AppThemes.DARK]: '#94a3b8' },
}
