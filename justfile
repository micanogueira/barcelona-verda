dev:
    npm run dev

build:
    npm run build

preview:
    npm run preview

install:
    npm install

typecheck:
    npx nuxi typecheck

db-schema:
    @echo "Copia o conteúdo de supabase/schema.sql e cola no SQL Editor do Supabase"
    @cat supabase/schema.sql
