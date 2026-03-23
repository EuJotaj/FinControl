import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';

type Translations = Record<string, Record<string, string>>;

const TRANSLATIONS: Translations = {
  // ── Sidebar ──────────────────────────────────────────────────────────────
  'nav.dashboard':      { 'pt-BR': 'Dashboard',       'en-US': 'Dashboard',       'es-ES': 'Panel' },
  'nav.profile':        { 'pt-BR': 'Meu Perfil',      'en-US': 'My Profile',      'es-ES': 'Mi Perfil' },
  'nav.transactions':   { 'pt-BR': 'Extrato',         'en-US': 'Transactions',    'es-ES': 'Extracto' },
  'nav.cards':          { 'pt-BR': 'Cartões',         'en-US': 'Cards',           'es-ES': 'Tarjetas' },
  'nav.invoices':       { 'pt-BR': 'Faturas',         'en-US': 'Invoices',        'es-ES': 'Facturas' },
  'nav.subscriptions':  { 'pt-BR': 'Assinaturas',     'en-US': 'Subscriptions',   'es-ES': 'Suscripciones' },
  'nav.categories':     { 'pt-BR': 'Categorias',      'en-US': 'Categories',      'es-ES': 'Categorías' },
  'nav.settings':       { 'pt-BR': 'Configurações',   'en-US': 'Settings',        'es-ES': 'Configuración' },
  'nav.section.main':   { 'pt-BR': 'Principal',       'en-US': 'Main',            'es-ES': 'Principal' },
  'nav.section.manage': { 'pt-BR': 'Gestão',          'en-US': 'Management',      'es-ES': 'Gestión' },
  'nav.view_profile':   { 'pt-BR': 'Ver Perfil',      'en-US': 'View Profile',    'es-ES': 'Ver Perfil' },
  'nav.billing':        { 'pt-BR': 'Plano de Assinatura','en-US': 'Subscription Tier','es-ES': 'Plan de Suscripción' },

  // ── Dashboard ─────────────────────────────────────────────────────────────
  'dashboard.title':          { 'pt-BR': 'Dashboard',           'en-US': 'Dashboard',            'es-ES': 'Panel' },
  'dashboard.subtitle':       { 'pt-BR': 'Visão geral das suas finanças', 'en-US': 'Overview of your finances', 'es-ES': 'Resumen de tus finanzas' },
  'dashboard.balance':        { 'pt-BR': 'Saldo Atual',         'en-US': 'Current Balance',      'es-ES': 'Saldo Actual' },
  'dashboard.income':         { 'pt-BR': 'Entradas',            'en-US': 'Income',               'es-ES': 'Ingresos' },
  'dashboard.expense':        { 'pt-BR': 'Saídas',              'en-US': 'Expenses',             'es-ES': 'Gastos' },
  'dashboard.cashflow':       { 'pt-BR': 'Fluxo de Caixa',      'en-US': 'Cash Flow',            'es-ES': 'Flujo de Caja' },
  'dashboard.recent':         { 'pt-BR': 'Últimas Transações',  'en-US': 'Recent Transactions',  'es-ES': 'Transacciones Recientes' },
  'dashboard.new_transaction':{ 'pt-BR': 'Nova Transação',      'en-US': 'New Transaction',      'es-ES': 'Nueva Transacción' },
  'dashboard.view_all':       { 'pt-BR': 'Ver extrato completo','en-US': 'View all transactions','es-ES': 'Ver todo el extracto' },
  'dashboard.loading':        { 'pt-BR': 'Carregando dashboard...', 'en-US': 'Loading dashboard...', 'es-ES': 'Cargando panel...' },
  'dashboard.balance_total':  { 'pt-BR': 'Saldo Consolidado',   'en-US': 'Consolidated Balance', 'es-ES': 'Saldo Consolidado' },
  'dashboard.cashflow_monthly':{ 'pt-BR': 'Fluxo de Caixa (Mensal)', 'en-US': 'Cash Flow (Monthly)', 'es-ES': 'Flujo de Caixa (Mensual)' },
  'dashboard.history':        { 'pt-BR': 'Histórico Recente',   'en-US': 'Recent History',       'es-ES': 'Historial Reciente' },
  'dashboard.no_chart':       { 'pt-BR': 'Visualização Técnica Indisponível', 'en-US': 'Technical Visualization Unavailable', 'es-ES': 'Visualización Técnica No Disponible' },
  'dashboard.waiting_chart':  { 'pt-BR': 'Aguardando integração com Chart.js', 'en-US': 'Waiting for Chart.js integration', 'es-ES': 'Esperando integración con Chart.js' },
  'dashboard.active_subscriptions': { 'pt-BR': 'Assinaturas Ativas', 'en-US': 'Active Subscriptions', 'es-ES': 'Suscripciones Activas' },
  'dashboard.recent_invoices': { 'pt-BR': 'Faturas Recentes', 'en-US': 'Recent Invoices', 'es-ES': 'Facturas Recientes' },
  'dashboard.invoice_pay': { 'pt-BR': 'Pagar', 'en-US': 'Pay', 'es-ES': 'Pagar' },
  'dashboard.invoice_status_paid': { 'pt-BR': 'Paga', 'en-US': 'Paid', 'es-ES': 'Pagada' },
  'dashboard.invoice_status_unpaid': { 'pt-BR': 'Aberta', 'en-US': 'Open', 'es-ES': 'Abierta' },

  // ── Subscriptions ─────────────────────────────────────────────────────────
  'subs.title':         { 'pt-BR': 'Assinaturas',               'en-US': 'Subscriptions',           'es-ES': 'Suscripciones' },
  'subs.subtitle':      { 'pt-BR': 'Controle seus serviços recorrentes', 'en-US': 'Track your recurring services', 'es-ES': 'Controla tus servicios recurrentes' },
  'subs.new':           { 'pt-BR': 'Nova Assinatura',           'en-US': 'New Subscription',       'es-ES': 'Nueva Suscripción' },
  'subs.count':         { 'pt-BR': 'Total de Assinaturas',      'en-US': 'Total Subscriptions',    'es-ES': 'Total de Suscripciones' },
  'subs.monthly_cost':  { 'pt-BR': 'Gasto Mensal',              'en-US': 'Monthly Spend',          'es-ES': 'Gasto Mensual' },
  'subs.annual_cost':   { 'pt-BR': 'Gasto Anual',               'en-US': 'Annual Spend',           'es-ES': 'Gasto Anual' },
  'subs.next_billing':  { 'pt-BR': 'Próximo',                   'en-US': 'Next',                   'es-ES': 'Próximo' },
  'subs.edit':          { 'pt-BR': 'Editar',                    'en-US': 'Edit',                   'es-ES': 'Editar' },
  'subs.empty':         { 'pt-BR': 'Nenhuma assinatura',        'en-US': 'No subscriptions',       'es-ES': 'Sin suscripciones' },
  'subs.empty_sub':     { 'pt-BR': 'Adicione seus serviços recorrentes para acompanhá-los.', 'en-US': 'Add your recurring services to track them.', 'es-ES': 'Añade tus servicios recurrentes para seguirlos.' },
  'subs.add':           { 'pt-BR': 'Adicionar Assinatura',      'en-US': 'Add Subscription',      'es-ES': 'Añadir Suscripción' },
  'subs.loading':       { 'pt-BR': 'Carregando assinaturas...', 'en-US': 'Loading subscriptions...', 'es-ES': 'Cargando suscripciones...' },
  'subs.per_year':      { 'pt-BR': 'por ano (mensais × 12)',    'en-US': 'per year (monthly × 12)', 'es-ES': 'por año (mensuales × 12)' },
  'subs.per_month':     { 'pt-BR': 'por mês (incluindo anuais ÷ 12)', 'en-US': 'per month (incl. annual ÷ 12)', 'es-ES': 'por mes (incl. anuales ÷ 12)' },

  // ── Settings ──────────────────────────────────────────────────────────────
  'settings.title':     { 'pt-BR': 'Configurações',     'en-US': 'Settings',         'es-ES': 'Configuración' },
  'settings.subtitle':  { 'pt-BR': 'Gerencie as preferências do seu sistema', 'en-US': 'Manage your system preferences', 'es-ES': 'Gestiona las preferencias del sistema' },
  'settings.regional':  { 'pt-BR': 'Preferências Regionais', 'en-US': 'Regional Preferences', 'es-ES': 'Preferencias Regionales' },
  'settings.language':  { 'pt-BR': 'Idioma do Sistema', 'en-US': 'System Language',  'es-ES': 'Idioma del Sistema' },
  'settings.lang_sub':  { 'pt-BR': 'Escolha o idioma principal da interface', 'en-US': 'Choose the main interface language', 'es-ES': 'Elige el idioma principal de la interfaz' },
  'settings.currency':  { 'pt-BR': 'Moeda Principal',   'en-US': 'Main Currency',    'es-ES': 'Moneda Principal' },
  'settings.curr_sub':  { 'pt-BR': 'Usada para exibir saldos e relatórios', 'en-US': 'Used to display balances and reports', 'es-ES': 'Usada para mostrar saldos e informes' },
  'settings.workspace_team': { 'pt-BR': 'Workspace & Equipe',   'en-US': 'Workspace & Team',      'es-ES': 'Espacio de Trabajo y Equipo' },
  'settings.manage_access':  { 'pt-BR': 'Gerenciar Acessos',    'en-US': 'Manage Access',        'es-ES': 'Gestionar Accesos' },
  'settings.team_desc':      { 'pt-BR': 'Protocolos de colaboração e permissões de membros.', 'en-US': 'Collaboration protocols and member permissions.', 'es-ES': 'Protocolos de colaboración y permisos de miembros.' },
  'settings.team_panel':     { 'pt-BR': 'Painel de Equipe',       'en-US': 'Team Dashboard',       'es-ES': 'Panel de Equipo' },
  'settings.team_title':     { 'pt-BR': 'Equipe & Acessos',       'en-US': 'Team & Access',        'es-ES': 'Equipo y Acceso' },
  'settings.team_subtitle':  { 'pt-BR': 'Gerencie quem pode visualizar, editar e colaborar nas finanças do workspace', 'en-US': 'Manage who can view, edit and collaborate on workspace finances', 'es-ES': 'Gestiona quién puede ver, editar y colaborar en las finanzas del espacio de trabajo' },
  'settings.team_invite':    { 'pt-BR': 'Convidar Membro',        'en-US': 'Invite Member',        'es-ES': 'Invitar Miembro' },
  'settings.team_active':    { 'pt-BR': 'Ativo',                  'en-US': 'Active',               'es-ES': 'Activo' },
  'settings.team_awaiting':  { 'pt-BR': 'Aguardando',             'en-US': 'Awaiting',             'es-ES': 'Esperando' },
  'settings.notifs':    { 'pt-BR': 'Notificações',      'en-US': 'Notifications',    'es-ES': 'Notificaciones' },
  'settings.push':      { 'pt-BR': 'Notificações Push', 'en-US': 'Push Notifications','es-ES': 'Notificaciones Push' },
  'settings.push_sub':  { 'pt-BR': 'Alertas em tempo real no navegador e celular', 'en-US': 'Real-time alerts in browser and mobile', 'es-ES': 'Alertas en tiempo real en navegador y móvil' },
  'settings.email_sum': { 'pt-BR': 'Resumo por E-mail', 'en-US': 'Email Summary',    'es-ES': 'Resumen por Email' },
  'settings.email_sub': { 'pt-BR': 'Relatórios financeiros semanais no seu e-mail', 'en-US': 'Weekly financial reports in your email', 'es-ES': 'Informes financieros semanales en tu email' },
  'settings.security':  { 'pt-BR': 'Segurança',         'en-US': 'Security',         'es-ES': 'Seguridad' },
  'settings.2fa':       { 'pt-BR': 'Autenticação em Dois Fatores (2FA)', 'en-US': 'Two-Factor Authentication (2FA)', 'es-ES': 'Autenticación de Dos Factores (2FA)' },
  'settings.2fa_sub':   { 'pt-BR': 'Adiciona uma camada extra de proteção via app autenticador', 'en-US': 'Adds an extra layer of protection via authenticator app', 'es-ES': 'Añade una capa extra de protección vía app autenticadora' },
  'settings.2fa_on':    { 'pt-BR': 'Ativado',           'en-US': 'Enabled',          'es-ES': 'Activado' },
  'settings.unsaved':   { 'pt-BR': 'Alterações não salvas', 'en-US': 'Unsaved changes', 'es-ES': 'Cambios sin guardar' },
  'settings.save':      { 'pt-BR': 'Salvar Configurações', 'en-US': 'Save Settings',  'es-ES': 'Guardar Configuración' },
  'settings.saving':    { 'pt-BR': 'Salvando...',       'en-US': 'Saving...',        'es-ES': 'Guardando...' },
  'settings.saved':     { 'pt-BR': 'Configurações salvas com sucesso!', 'en-US': 'Settings saved successfully!', 'es-ES': '¡Configuración guardada con éxito!' },
  'settings.error':     { 'pt-BR': 'Erro ao salvar. Verifique sua conexão e tente novamente.', 'en-US': 'Error saving. Check your connection and try again.', 'es-ES': 'Error al guardar. Verifica tu conexión e inténtalo de nuevo.' },

  // ── Profile ───────────────────────────────────────────────────────────────
  'profile.title':      { 'pt-BR': 'Meu Perfil',        'en-US': 'My Profile',      'es-ES': 'Mi Perfil' },
  'profile.subtitle':   { 'pt-BR': 'Personalize suas informações e aparência', 'en-US': 'Customize your info and appearance', 'es-ES': 'Personaliza tu información y apariencia' },
  'profile.save':       { 'pt-BR': 'Salvar Alterações', 'en-US': 'Save Changes',     'es-ES': 'Guardar Cambios' },
  'profile.saved':      { 'pt-BR': 'Perfil salvo com sucesso!', 'en-US': 'Profile saved successfully!', 'es-ES': '¡Perfil guardado con éxito!' },
  'profile.operator':   { 'pt-BR': 'Operador',          'en-US': 'Operator',        'es-ES': 'Operador' },
  'profile.identity':   { 'pt-BR': 'Identidade de Acesso Total', 'en-US': 'Full Access Identity', 'es-ES': 'Identidad de Acceso Total' },
  'profile.transmission_email': { 'pt-BR': 'E-mail de Transmissão', 'en-US': 'Transmission Email', 'es-ES': 'Email de Transmisión' },
  'profile.signal_phone': { 'pt-BR': 'Telefone de Sinal', 'en-US': 'Signal Phone', 'es-ES': 'Teléfono de Señal' },
  'profile.briefing':   { 'pt-BR': 'Briefing (Bio)',    'en-US': 'Briefing (Bio)',   'es-ES': 'Resumen (Bio)' },
  'profile.sync':       { 'pt-BR': 'Sincronizar Perfil','en-US': 'Sync Profile',     'es-ES': 'Sincronizar Perfil' },
  'profile.protocol_saved': { 'pt-BR': 'Protocolo de salvamento concluído.', 'en-US': 'Save protocol completed.', 'es-ES': 'Protocolo de salvado completado.' },
  'profile.save_error': { 'pt-BR': 'Falha na transmissão dos dados.', 'en-US': 'Data transmission failure.', 'es-ES': 'Fallo en la transmisión de datos.' },
  'profile.link_status':{ 'pt-BR': 'Status do Link',    'en-US': 'Link Status',      'es-ES': 'Estado del Link' },
  'profile.active_pro': { 'pt-BR': 'Conexão Ativa / PRO','en-US': 'Active Connection / PRO','es-ES': 'Conexión Activa / PRO' },

  // ── Common ────────────────────────────────────────────────────────────────
  'common.save':        { 'pt-BR': 'Salvar',            'en-US': 'Save',            'es-ES': 'Guardar' },
  'common.cancel':      { 'pt-BR': 'Cancelar',          'en-US': 'Cancel',          'es-ES': 'Cancelar' },
  'common.edit':        { 'pt-BR': 'Editar',            'en-US': 'Edit',            'es-ES': 'Editar' },
  'common.delete':      { 'pt-BR': 'Excluir',           'en-US': 'Delete',          'es-ES': 'Eliminar' },
  'common.loading':     { 'pt-BR': 'Carregando...',     'en-US': 'Loading...',      'es-ES': 'Cargando...' },
  'common.monthly':     { 'pt-BR': 'Mensal',            'en-US': 'Monthly',         'es-ES': 'Mensual' },
  'common.annual':      { 'pt-BR': 'Anual',             'en-US': 'Annual',          'es-ES': 'Anual' },
  'common.role_user':   { 'pt-BR': 'Operador do Sistema', 'en-US': 'System Operator', 'es-ES': 'Operador del Sistema' },
  'common.role_admin':  { 'pt-BR': 'Administrador',     'en-US': 'Administrator',    'es-ES': 'Administrador' },

  // ── Topbar ────────────────────────────────────────────────────────────────
  'topbar.search':      { 'pt-BR': 'Buscar...',         'en-US': 'Search...',        'es-ES': 'Buscar...' },
  'topbar.workspaces':  { 'pt-BR': 'Espaços',           'en-US': 'Workspaces',       'es-ES': 'Espacios' },
  'topbar.new_workspace':{ 'pt-BR': 'Novo Workspace',   'en-US': 'New Workspace',    'es-ES': 'Nuevo Workspace' },
  'topbar.upgrade':     { 'pt-BR': 'Fazer Upgrade PRO', 'en-US': 'Upgrade to PRO',   'es-ES': 'Actualizar a PRO' },
  'topbar.manage_team': { 'pt-BR': 'Gerenciar Equipe',  'en-US': 'Manage Team',      'es-ES': 'Gestionar Equipo' },
  'topbar.notifications':{ 'pt-BR': 'Notificações',     'en-US': 'Notifications',    'es-ES': 'Notificaciones' },
  'topbar.new_notifs':  { 'pt-BR': 'nova(s)',           'en-US': 'new',              'es-ES': 'nueva(s)' },
  'topbar.mark_read':   { 'pt-BR': 'Marcar todas lidas','en-US': 'Mark all as read', 'es-ES': 'Marcar como leídas' },
  'topbar.no_notifs':   { 'pt-BR': 'Nenhuma notificação','en-US': 'No notifications', 'es-ES': 'Sin notificaciones' },
  'topbar.light_mode':  { 'pt-BR': 'Modo Claro',        'en-US': 'Light Mode',       'es-ES': 'Modo Claro' },
  'topbar.dark_mode':   { 'pt-BR': 'Modo Escuro',       'en-US': 'Dark Mode',        'es-ES': 'Modo Oscuro' },
  'topbar.logout':      { 'pt-BR': 'Sair',              'en-US': 'Logout',           'es-ES': 'Salir' },
  'topbar.loading':     { 'pt-BR': 'Carregando...',     'en-US': 'Loading...',       'es-ES': 'Cargando...' },
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  constructor(private settingsService: SettingsService) {}

  /** Translates a key to the current language. Falls back to pt-BR then the key itself. */
  t(key: string): string {
    const lang = this.settingsService.language;
    const map = TRANSLATIONS[key];
    if (!map) return key;
    return map[lang] ?? map['pt-BR'] ?? key;
  }
}
