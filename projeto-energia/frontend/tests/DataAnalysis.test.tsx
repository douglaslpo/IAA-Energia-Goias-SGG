import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import DataAnalysisPage from '../frontend/pages/DataAnalysis';
import { ThemeProvider } from 'styled-components';
import { theme } from '../frontend/styles/theme';

// Mock do serviço
jest.mock('../frontend/services/api', () => ({
    analysisService: {
        getAnalysisData: jest.fn().mockResolvedValue({
            analysis: [],
            weather: [],
            insights: []
        })
    }
}));

describe('DataAnalysisPage', () => {
    const renderWithTheme = (component: React.ReactNode) => {
        return render(
            <ThemeProvider theme={theme}>
                {component}
            </ThemeProvider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve mudar granularidade ao clicar nos botões de período', async () => {
        const user = userEvent.setup();
        renderWithTheme(<DataAnalysisPage />);
        
        await user.click(screen.getByText('1 Mês'));
        
        await waitFor(() => {
            expect(screen.getByText(/Período:/)).toBeInTheDocument();
            const dateText = screen.getByText(/Período:/);
            expect(dateText).toHaveTextContent(/01\/03\/2024.*31\/03\/2024/);
        });
    });

    test('deve atualizar dados do gráfico com nova granularidade', async () => {
        const { container } = renderWithTheme(<DataAnalysisPage />);
        
        userEvent.click(screen.getByText('3 Meses'));
        
        await waitFor(() => {
            const points = container.querySelectorAll('.recharts-scatter-symbol');
            expect(points.length).toBeGreaterThan(60);
        });
    });

    test('deve manter consistência entre período e granularidade', async () => {
        renderWithTheme(<DataAnalysisPage />);
        
        userEvent.click(screen.getByText('1 Semana'));
        
        await waitFor(() => {
            const dateText = screen.getByText(/Período:/);
            const days = dateText.textContent?.match(/\d+/g);
            expect(Number(days?.[0])).toBeLessThanOrEqual(7);
        });
    });
}); 