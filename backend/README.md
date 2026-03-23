# FinControl Backend (API)

Este é o backend do **Gerenciador Financeiro Pessoal**, uma API robusta construída com Spring Boot para gerenciar finanças pessoais e de pequenos negócios.

## 🚀 Tecnologias
- **Java 17+**
- **Spring Boot 3**
- **Spring Security + JWT**
- **Hibernate / JPA / MySQL**
- **Maven**

## 🛠️ Funcionalidades Principais
- **Multi-Tenancy**: Suporte a múltiplos workspaces (ex: finanças pessoais e negócios separados).
- **Gestão Financeira**: Controle de receitas, despesas e faturas de cartão de crédito.
- **Autenticação Segura**: Implementação de JWT para proteção de rotas.
- **Estrutura Modular**: Separação clara entre infraestrutura, aplicação e domínio.

## ⚙️ Como Executar
1. Certifique-se de ter o **MySQL 8+** instalado.
2. Copie o arquivo `src/main/resources/application.properties.example` para `src/main/resources/application.properties`.
3. Configure a senha do banco de dados e o segredo do JWT no novo arquivo.
4. Execute via Maven:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

## 📂 Estrutura do Projeto
- `src/main/java/com/fincontrol/api`: Controladores e DTOs.
- `src/main/java/com/fincontrol/domain`: Modelos e lógica de negócio.
- `src/main/java/com/fincontrol/infrastructure`: Configurações de banco, tenant e segurança.
