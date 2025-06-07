declare module 'react-icons/fa' {
    import { IconType } from 'react-icons';
    
    export const FaChartLine: IconType;
    export const FaBrain: IconType;
    export const FaDatabase: IconType;
    export const FaChartBar: IconType;
    export const FaBell: IconType;
    export const FaCog: IconType;
    export const FaBars: IconType;
    export const FaTimes: IconType;
    export const FaUpload: IconType;
    export const FaEdit: IconType;
    export const FaCheck: IconType;
}

declare module 'react-router-dom' {
    export interface RouteProps {
        path?: string;
        element?: React.ReactNode;
    }
    
    export const BrowserRouter: React.FC<{ children: React.ReactNode }>;
    export const Routes: React.FC<{ children: React.ReactNode }>;
    export const Route: React.FC<RouteProps>;
    export const Navigate: React.FC<{ to: string; replace?: boolean }>;
    export const Link: React.FC<{ to: string; children: React.ReactNode }>;
    export function useNavigate(): (path: string) => void;
    export function useLocation(): { pathname: string };
} 