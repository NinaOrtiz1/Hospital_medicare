# Hospital_medicare

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_xaA3WhgN7fNWEOgIAxIQcn62ToiV)

## Getting Started

### Backend Setup (PHP/MySQL)

1. Install XAMPP or a similar PHP/MySQL server.
2. Copy the PHP files (`config.php`, `pacientes.php`, `medicos.php`, `citas.php`, `usuarios.php`, `setup.php`) to your web server's document root (e.g., `htdocs/hospital_medicare/`).
3. Update the database credentials in `config.php` if necessary.
4. Run `setup.php` in your browser to create the database and tables: `http://localhost/hospital_medicare/setup.php`
5. The API endpoints are proxied through Next.js at `/api/pacientes`, `/api/medicos`, `/api/citas`, `/api/usuarios`.

### Frontend Setup (Next.js)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/NinaOrtiz1/Hospital_medicare" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
