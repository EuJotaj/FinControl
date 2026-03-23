-- Script de criação do banco de dados fincontrol
CREATE DATABASE IF NOT EXISTS fincontrol CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE fincontrol;

-- As tabelas serão criadas automaticamente pelo Hibernate (ddl-auto=update),
-- O schema agora suporta Multi-Tenancy (SaaS Workspace Isolation).
-- Tabelas principais criadas automaticamente:
-- * tenants (Workspaces)
-- * plans (Planos SaaS: FREE, PRO, BUSINESS)
-- * users (Usuários globais)
-- 
-- Entidades de Domínio agora possuem a coluna 'tenant_id' para isolamento lógico:
-- * transactions
-- * categories
-- * credit_cards
-- * invoices
-- * subscriptions
-- * notifications
-- * user_settings
