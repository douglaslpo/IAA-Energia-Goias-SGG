import type { Alerta } from '@/types'

class NotificationService {
  private static instance: NotificationService
  private notifications: Alerta[] = []
  private listeners: ((alerts: Alerta[]) => void)[] = []

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  addNotification(notification: Omit<Alerta, 'id'>): void {
    const newNotification: Alerta = {
      id: Date.now(),
      ...notification
    }
    this.notifications.unshift(newNotification)
    this.notifyListeners()
  }

  removeNotification(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id)
    this.notifyListeners()
  }

  clearNotifications(): void {
    this.notifications = []
    this.notifyListeners()
  }

  getNotifications(): Alerta[] {
    return [...this.notifications]
  }

  subscribe(listener: (alerts: Alerta[]) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners(): void {
    const notifications = this.getNotifications()
    this.listeners.forEach(listener => listener(notifications))
  }

  // Métodos de conveniência para diferentes tipos de notificações
  info(titulo: string, mensagem: string): void {
    this.addNotification({
      titulo,
      descricao: mensagem,
      tipo: 'info'
    })
  }

  success(titulo: string, mensagem: string): void {
    this.addNotification({
      titulo,
      descricao: mensagem,
      tipo: 'success'
    })
  }

  warning(titulo: string, mensagem: string): void {
    this.addNotification({
      titulo,
      descricao: mensagem,
      tipo: 'warning'
    })
  }

  error(titulo: string, mensagem: string): void {
    this.addNotification({
      titulo,
      descricao: mensagem,
      tipo: 'error'
    })
  }
}

export const notificationService = NotificationService.getInstance() 