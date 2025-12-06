Você está no modo incremental. Não use task_progress.
Quero que você aja exatamente como o GitHub Copilot: 
- só leia arquivos quando eu pedir ou quando o erro indicar
- aplique correções pequenas
- não crie arquivos
- não faça imports que não existam no projeto
- me peça permissão antes de editar qualquer arquivo
- rode os testes somente depois da minha autorização.

Erro do teste:
TypeError: Cannot read properties of undefined (reading 'name')

Quero que analise o erro e diga:
1. qual arquivo você precisa ler
2. diagnóstico provável
3. possíveis pontos para corrigir
4. peça permissão antes de abrir qualquer arquivo

====================================================

O erro continua. Leia o arquivo pokemon-card.component.ts para ver a linha onde o store.typeData() é usado. Me peça antes de abrir.

