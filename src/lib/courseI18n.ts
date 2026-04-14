import type { Locale } from "../types/locale";

const PROVIDER_EN: Record<string, string> = {
  "Fundação Bradesco": "Bradesco Foundation",
  "Azure na prática": "Azure in practice",
  "Aliança Brasileira pela Educação": "Brazilian Alliance for Education",
  "LinkedIn Learning": "LinkedIn Learning",
};

const PROVIDER_ES: Record<string, string> = {
  "Fundação Bradesco": "Fundación Bradesco",
  "Azure na prática": "Azure en la práctica",
  "Aliança Brasileira pela Educação": "Alianza Brasileña por la Educación",
  "LinkedIn Learning": "LinkedIn Learning",
};

export function localizeCourseProvider(provider: string, locale: Locale): string {
  if (locale === "pt") return provider;
  if (locale === "en") return PROVIDER_EN[provider] ?? provider;
  return PROVIDER_ES[provider] ?? provider;
}

/** PT course line → English */
function toEn(s: string): string {
  const exact: Record<string, string> = {
    "Treinamento Lei Geral de Proteção de Dados CVC Corp – 2020 – 1 Hora":
      "CVC Corp LGPD (General Data Protection Law) training – 2020 – 1 hour",
    "Comunicação Empatica – 2020 – 1 Hora":
      "Empathic communication – 2020 – 1 hour",
    "Scrum + XP = Agilidade eXtrema – Global Code – 2009 – 3 Horas":
      "Scrum + XP = eXtreme agility – Global Code – 2009 – 3 hours",
    "Treinamento em SCRUM com Fábio Câmara, pela empresa Thomas Greg & Sons – 2010 – 5 Horas":
      "SCRUM training with Fábio Câmara, Thomas Greg & Sons – 2010 – 5 hours",
    "Fundamentos para Análise de Dados por Microsoft e LinkedIn – 2024 – 10 Horas":
      "Data analysis fundamentals by Microsoft and LinkedIn – 2024 – 10 hours",
    "Introdução à Ciência de Dados: Como Contar Histórias com Dados – 2024 – 2 Horas":
      "Introduction to data science: telling stories with data – 2024 – 2 hours",
    "Análise de Dados Parte 1: Conceitos Básicos – 2024 – 4 Horas":
      "Data analysis part 1: basic concepts – 2024 – 4 hours",
    "Análise de Dados Parte 2: Ampliação e Aplicação do Conhecimento Básico – 2024 – 4 Horas":
      "Data analysis part 2: expanding and applying basic knowledge – 2024 – 4 hours",
    "Introdução às Competências Essenciais para a Carreira de Análise de Dados – 2022 – 3 Horas":
      "Introduction to essential skills for a data analyst career – 2022 – 3 hours",
    "Comunicação Assertiva para Gestores de Alto Desempenho – 2026 – 2 Horas":
      "Assertive communication for high-performing managers – 2026 – 2 hours",
    "Webinar Datadog: Seu guia para um APM proativo e unificado – 2026 – 1 Hora":
      "Datadog webinar: your guide to proactive, unified APM – 2026 – 1 hour",
    "Meetup – Desenhando com IA Arquiteturas de Soluções: um exemplo com draw.io MCP Server + VS Code + Copilot – 2026 – 1 Hora":
      "Meetup – Designing solution architectures with AI: an example with draw.io MCP Server + VS Code + Copilot – 2026 – 1 hour",
    "Meetup – Gerando diagramas de arquitetura com IA: um exemplo com draw.io MCP Server + VS Code – 2026 – 1 Hora":
      "Meetup – Generating architecture diagrams with AI: an example with draw.io MCP Server + VS Code – 2026 – 1 hour",
    "MongoDB.local São Paulo – 2024": "MongoDB.local São Paulo – 2024",
    "Python para Iniciantes (Instrutor: Tiago Miguel) – 2026 – 1 Hora":
      "Python for beginners (Instructor: Tiago Miguel) – 2026 – 1 hour",
    "Gestão e liderança de desenvolvedores – LinkedIn Learning – 2026 – 9 Horas":
      "Managing and Leading Developers – LinkedIn Learning – 2026 – 9 hours",
    "Meetup – Grafana + Inteligência Artificial: monitorando o consumo de tokens ao utilizar o Microsoft Foundry – 2026 – 3 Horas":
      "Meetup – Grafana and artificial intelligence: monitoring token consumption with Microsoft Foundry – 2026 – 3 hours",
    "Meetup – OWASP + API Security: dicas de segurança – Security Headers, CORS, manipulando informações sensíveis – 2026 – 3 Horas":
      "Meetup – OWASP + API security: practical tips – security headers, CORS, handling sensitive information – 2026 – 3 hours",
  };
  if (exact[s]) return exact[s];

  let t = s;
  t = t.replace(/\((Instrutor):\s*/g, "(Instructor: ");
  t = t.replace(/\((Instrutor)\s+/g, "(Instructor ");
  t = t.replace(/\bInstrutor:\s*/g, "Instructor: ");
  t = t.replace(/\bInstrutor\s+/g, "Instructor ");

  const pairs: [RegExp, string][] = [
    [/Introdução à linguagem (\w+) \(/g, "Introduction to the $1 language ("],
    [
      /Introdução à Criação de sites dinâmicos com PHP/g,
      "Introduction to building dynamic websites with PHP",
    ],
    [
      /Introdução à programação de computadores – Python/g,
      "Introduction to computer programming – Python",
    ],
    [/Introdução à linguagem Python/g, "Introduction to the Python language"],
    [/Introdução a banco de dados/g, "Introduction to databases"],
    [
      /Introdução ao PHP Orientado a Objetos/g,
      "Introduction to object-oriented PHP",
    ],
    [/Introdução ao JSON com C#/g, "Introduction to JSON with C#"],
    [/Introdução ao ASP\.NET Core 1\.0/g, "Introduction to ASP.NET Core 1.0"],
    [
      /Introdução ao NodeJS com Typescript/g,
      "Introduction to Node.js with TypeScript",
    ],
    [/Introdução ao jQuery/g, "Introduction to jQuery"],
    [/Introdução ao Javascript/g, "Introduction to JavaScript"],
    [
      /Introdução ao Sistema Operacional Linux/g,
      "Introduction to the Linux operating system",
    ],
    [/Introdução à administração/g, "Introduction to administration"],
    [/Introdução à gestão de projetos/g, "Introduction to project management"],
    [/HTML Básico/g, "Basic HTML"],
    [/HTML Avançado/g, "Advanced HTML"],
    [/HTML e CSS na prática/g, "HTML and CSS in practice"],
    [/Modelagem de Dados/g, "Data modeling"],
    [
      /Administração e Planejamento de Finanças/g,
      "Administration and financial planning",
    ],
    [
      /Sistemas Operacionais – Conceitos Básicos/g,
      "Operating systems – basic concepts",
    ],
    [
      /Administração no Século 21 \(Trilha de Conhecimento\) 2018\/2019/g,
      "21st-century administration (learning path) 2018/2019",
    ],
    [/Empreendedorismo e Inovação/g, "Entrepreneurship and innovation"],
    [/Empreendedorismo –/g, "Entrepreneurship –"],
    [
      /Responsabilidade Social e Sustentabilidade/g,
      "Social responsibility and sustainability",
    ],
    [/Lógica de Programação/g, "Programming logic"],
    [/Desvendando a Blockchain/g, "Demystifying blockchain"],
    [/Desvendando a Industria 4\.0/g, "Demystifying Industry 4.0"],
    [/Finanças Pessoais/g, "Personal finance"],
    [
      /Tecnologia da Informação e Comunicação/g,
      "Information and communication technology",
    ],
    [/Propriedade Intelectual/g, "Intellectual property"],
    [/Consumo Consciente de Energia/g, "Conscious energy consumption"],
    [/Educação Ambiental/g, "Environmental education"],
    [/Fundamentos de Logística/g, "Logistics fundamentals"],
    [/Segurança no Trabalho/g, "Workplace safety"],
    [/Legislação Trabalhista/g, "Labor law"],
    [
      /Boas Práticas e Competências do SCRUM MASTER/g,
      "SCRUM Master practices and competencies",
    ],
    [/Boas Práticas em PHP/g, "PHP best practices"],
    [/Gestão de Tecnologia de Informação/g, "Information technology management"],
    [/Matemática Financeira/g, "Financial mathematics"],
    [
      /BSC: Introdução à criação e execução da estratégia/g,
      "BSC: introduction to creating and executing strategy",
    ],
    [
      /Definições e objetivos da gestão de projetos/g,
      "Definitions and goals of project management",
    ],
    [/Fundamentos da Gestão de TI/g, "IT management fundamentals"],
    [/Aprenda Markdown/g, "Learn Markdown"],
    [/Inteligência Emocional no Trabalho/g, "Emotional intelligence at work"],
    [
      /Criando páginas web com o GitHub Pages/g,
      "Building web pages with GitHub Pages",
    ],
    [/Produtividade máxima com VS Code/g, "Maximum productivity with VS Code"],
    [/ReactJS – Aprendendo Rápido/g, "ReactJS – quick learning"],
    [
      /Curso React\.js Ninja: Módulo React \+ Webpack/g,
      "React.js Ninja course: React + Webpack module",
    ],
    [/Git e Git Hub para iniciantes/g, "Git and GitHub for beginners"],
    [/Banco de Dados MySql/g, "MySQL database"],
    [
      /BLAST: Ferramenta de Alinhamentos Locais de Sequências/g,
      "BLAST: local sequence alignment tool",
    ],
    [
      /GIMP: o editor de imagens gratuito para Windows Linux e Mac/g,
      "GIMP: free image editor for Windows, Linux and Mac",
    ],
    [
      /Minicurso Qlikview do Zero – Introdução ao Qlik!/g,
      "Qlikview mini-course from scratch – introduction to Qlik!",
    ],
    [
      /Web Design: Construa Sites com PHP/g,
      "Web design: building sites with PHP",
    ],
    [
      /Data Science: Visualização de dados com Python/g,
      "Data science: data visualization with Python",
    ],
    [/Criando sites estáticos com Jekyll/g, "Building static sites with Jekyll"],
    [
      /Bootstrap 4: Completo e Direto ao Ponto \+ 7 Projetos/g,
      "Bootstrap 4: complete and to the point + 7 projects",
    ],
    [
      /Criando um ambiente de Desenvolvimento no Windows/g,
      "Setting up a development environment on Windows",
    ],
    [
      /Git e contribuições para projetos Open Source/g,
      "Git and contributions to open source projects",
    ],
    [/React, Redux e integração de APIs/g, "React, Redux and API integration"],
    [
      /Adobe XD: Design de Interfaces para Criação de Sites/g,
      "Adobe XD: UI design for building websites",
    ],
    [/Positividade e Inteligência Emocional/g, "Positivity and emotional intelligence"],
    [/Conceitos básicos de C# para iniciantes/g, "Basic C# concepts for beginners"],
    [/Fundamentos do C# com Clean Code/g, "C# fundamentals with clean code"],
    [/HTML5 – Homologado pelo W3C/g, "HTML5 – W3C-validated"],
    [/ASP\.NET MVC 5 Conceitos Básicos/g, "ASP.NET MVC 5 – basic concepts"],
    [/ASP\.NET MVC Intermediário/g, "ASP.NET MVC – intermediate"],
    [/ASP\.Net Core 2\.0 \(Trilha de Conhecimento\)/g, "ASP.NET Core 2.0 (learning path)"],
    [/MEAN Stack Development \(Trilha de Conhecimento\)/g, "MEAN stack development (learning path)"],
    [/DevOps for Developers \(Trilha de Conhecimento\)/g, "DevOps for developers (learning path)"],
    [/Trilha de Conhecimento/g, "learning path"],
    [/Conceitos Ageis: SCRUM/g, "Agile concepts: SCRUM"],
    [/II Workshop de Tecnologia da Fatec Mauá/g, "II Technology Workshop – Fatec Mauá"],
    [/I Semana da Tecnologia Fatec – Mauá/g, "I Technology Week – Fatec Mauá"],
    [/III Workshop de Tecnologia da Fatec Mauá/g, "III Technology Workshop – Fatec Mauá"],
    [
      /II Semana de Tecnologia da Faculdade de Tecnologia Termomecanica/g,
      "II Technology Week – Termomechanics College of Technology",
    ],
    [
      /III Semana de Tecnologia da Faculdade de Tecnologia Termomecanica/g,
      "III Technology Week – Termomechanics College of Technology",
    ],
    [
      /IV Semana de Tecnologia da Faculdade de Tecnologia Termomecanica/g,
      "IV Technology Week – Termomechanics College of Technology",
    ],
    [/Expositor Thomas Greg & Sons/g, "exhibitor Thomas Greg & Sons"],
    [/Acessibilidade na Web, por Reinaldo Ferraz/g, "Web accessibility, by Reinaldo Ferraz"],
    [
      /Bluetalk: CI\/CD numa esteira DevOps Open, Escalável, em ‘casa’ com IBM Cloud Private/g,
      "Bluetalk: CI/CD on an open, scalable in-house DevOps pipeline with IBM Cloud Private",
    ],
    [
      /Meetup: Adicionando um paradigma funcional em sua caixa de ferramentas com Clojure/g,
      "Meetup: adding a functional paradigm to your toolbox with Clojure",
    ],
    [
      /Meetup: Javascript: Programação Funcional e ECMAScript 6/g,
      "Meetup: JavaScript – functional programming and ECMAScript 6",
    ],
    [/Meetup: Arquitetura Clean Code/g, "Meetup: Clean Code architecture"],
    [/Palestra: Evolução Profissional e Pessoal/g, "Talk: professional and personal growth"],
    [/Webinar: DevOps: Docker e Kubernetes/g, "Webinar: DevOps – Docker and Kubernetes"],
    [/Webinar: DevOps: Quality gates no SonarQube/g, "Webinar: DevOps – quality gates in SonarQube"],
    [/Webinar: DevOps: Pipeline e RFC/g, "Webinar: DevOps – pipeline and RFC"],
    [/Webinar: DevOps: Vault e Consul/g, "Webinar: DevOps – Vault and Consul"],
    [/Webinar DevOps: Jenkins Jobs e AppStructure/g, "Webinar DevOps – Jenkins jobs and AppStructure"],
  ];
  for (const [re, rep] of pairs) t = t.replace(re, rep);

  t = t.replace(/(\s–\s\d{4}\s–\s)(\d+(?:,\d+)?)\s+Horas\b/g, "$1$2 hours");
  t = t.replace(/(\s–\s\d{4}\s–\s)1\s+Hora\b/g, "$11 hour");
  t = t.replace(/(\s–\s)(\d+(?:,\d+)?)\s+Horas$/g, "$1$2 hours");
  t = t.replace(/(\s)(\d+(?:,\d+)?)\s+Horas$/g, "$1$2 hours");
  t = t.replace(/(\s)1\s+Hora$/g, "$11 hour");
  return t;
}

/** PT course line → Spanish */
function toEs(s: string): string {
  const exact: Record<string, string> = {
    "Treinamento Lei Geral de Proteção de Dados CVC Corp – 2020 – 1 Hora":
      "Formación LGPD CVC Corp – 2020 – 1 hora",
    "Comunicação Empatica – 2020 – 1 Hora":
      "Comunicación empática – 2020 – 1 hora",
    "Scrum + XP = Agilidade eXtrema – Global Code – 2009 – 3 Horas":
      "Scrum + XP = agilidad eXtrema – Global Code – 2009 – 3 horas",
    "Treinamento em SCRUM com Fábio Câmara, pela empresa Thomas Greg & Sons – 2010 – 5 Horas":
      "Formación en SCRUM con Fábio Câmara, Thomas Greg & Sons – 2010 – 5 horas",
    "Fundamentos para Análise de Dados por Microsoft e LinkedIn – 2024 – 10 Horas":
      "Fundamentos de análisis de datos por Microsoft y LinkedIn – 2024 – 10 horas",
    "Introdução à Ciência de Dados: Como Contar Histórias com Dados – 2024 – 2 Horas":
      "Introducción a la ciencia de datos: contar historias con datos – 2024 – 2 horas",
    "Análise de Dados Parte 1: Conceitos Básicos – 2024 – 4 Horas":
      "Análisis de datos parte 1: conceptos básicos – 2024 – 4 horas",
    "Análise de Dados Parte 2: Ampliação e Aplicação do Conhecimento Básico – 2024 – 4 Horas":
      "Análisis de datos parte 2: ampliación y aplicación del conocimiento básico – 2024 – 4 horas",
    "Introdução às Competências Essenciais para a Carreira de Análise de Dados – 2022 – 3 Horas":
      "Introducción a las competencias esenciales para la carrera de análisis de datos – 2022 – 3 horas",
    "Comunicação Assertiva para Gestores de Alto Desempenho – 2026 – 2 Horas":
      "Comunicación asertiva para gestores de alto rendimiento – 2026 – 2 horas",
    "Webinar Datadog: Seu guia para um APM proativo e unificado – 2026 – 1 Hora":
      "Webinar Datadog: tu guía para un APM proactivo y unificado – 2026 – 1 hora",
    "Meetup – Desenhando com IA Arquiteturas de Soluções: um exemplo com draw.io MCP Server + VS Code + Copilot – 2026 – 1 Hora":
      "Meetup – Diseñando arquitecturas de soluciones con IA: un ejemplo con draw.io MCP Server + VS Code + Copilot – 2026 – 1 hora",
    "Meetup – Gerando diagramas de arquitetura com IA: um exemplo com draw.io MCP Server + VS Code – 2026 – 1 Hora":
      "Meetup – Generando diagramas de arquitectura con IA: un ejemplo con draw.io MCP Server + VS Code – 2026 – 1 hora",
    "MongoDB.local São Paulo – 2024": "MongoDB.local São Paulo – 2024",
    "Python para Iniciantes (Instrutor: Tiago Miguel) – 2026 – 1 Hora":
      "Python para principiantes (Instructor: Tiago Miguel) – 2026 – 1 hora",
    "Gestão e liderança de desenvolvedores – LinkedIn Learning – 2026 – 9 Horas":
      "Gestión y liderazgo de desarrolladores – LinkedIn Learning – 2026 – 9 horas",
    "Meetup – Grafana + Inteligência Artificial: monitorando o consumo de tokens ao utilizar o Microsoft Foundry – 2026 – 3 Horas":
      "Meetup – Grafana e inteligencia artificial: monitorizando el consumo de tokens con Microsoft Foundry – 2026 – 3 horas",
    "Meetup – OWASP + API Security: dicas de segurança – Security Headers, CORS, manipulando informações sensíveis – 2026 – 3 Horas":
      "Meetup – OWASP y seguridad de APIs: consejos – cabeceras de seguridad, CORS, tratamiento de información sensible – 2026 – 3 horas",
  };
  if (exact[s]) return exact[s];

  let t = s;
  t = t.replace(/\((Instrutor):\s*/g, "(Instructor: ");
  t = t.replace(/\((Instrutor)\s+/g, "(Instructor ");
  t = t.replace(/\bInstrutor:\s*/g, "Instructor: ");
  t = t.replace(/\bInstrutor\s+/g, "Instructor ");

  const pairs: [RegExp, string][] = [
    [/Introdução à linguagem (\w+) \(/g, "Introducción al lenguaje $1 ("],
    [
      /Introdução à Criação de sites dinâmicos com PHP/g,
      "Introducción a sitios dinámicos con PHP",
    ],
    [
      /Introdução à programação de computadores – Python/g,
      "Introducción a la programación – Python",
    ],
    [/Introdução à linguagem Python/g, "Introducción al lenguaje Python"],
    [/Introdução a banco de dados/g, "Introducción a bases de datos"],
    [/Introdução ao PHP Orientado a Objetos/g, "Introducción a PHP orientado a objetos"],
    [/Introdução ao JSON com C#/g, "Introducción a JSON con C#"],
    [/Introdução ao ASP\.NET Core 1\.0/g, "Introducción a ASP.NET Core 1.0"],
    [
      /Introdução ao NodeJS com Typescript/g,
      "Introducción a Node.js con TypeScript",
    ],
    [/Introdução ao jQuery/g, "Introducción a jQuery"],
    [/Introdução ao Javascript/g, "Introducción a JavaScript"],
    [/Introdução ao Sistema Operacional Linux/g, "Introducción al sistema operativo Linux"],
    [/Introdução à administração/g, "Introducción a la administración"],
    [/Introdução à gestão de projetos/g, "Introducción a la gestión de proyectos"],
    [/HTML Básico/g, "HTML básico"],
    [/HTML Avançado/g, "HTML avanzado"],
    [/HTML e CSS na prática/g, "HTML y CSS en la práctica"],
    [/Modelagem de Dados/g, "Modelado de datos"],
    [
      /Administração e Planejamento de Finanças/g,
      "Administración y planificación financiera",
    ],
    [/Sistemas Operacionais – Conceitos Básicos/g, "Sistemas operativos – conceptos básicos"],
    [
      /Administração no Século 21 \(Trilha de Conhecimento\) 2018\/2019/g,
      "Administración en el siglo XXI (itinerario formativo) 2018/2019",
    ],
    [/Empreendedorismo e Inovação/g, "Emprendimiento e innovación"],
    [/Empreendedorismo –/g, "Emprendimiento –"],
    [
      /Responsabilidade Social e Sustentabilidade/g,
      "Responsabilidad social y sostenibilidad",
    ],
    [/Lógica de Programação/g, "Lógica de programación"],
    [/Desvendando a Blockchain/g, "Descubriendo blockchain"],
    [/Desvendando a Industria 4\.0/g, "Descubriendo la industria 4.0"],
    [/Finanças Pessoais/g, "Finanzas personales"],
    [
      /Tecnologia da Informação e Comunicação/g,
      "Tecnología de la información y la comunicación",
    ],
    [/Propriedade Intelectual/g, "Propiedad intelectual"],
    [/Consumo Consciente de Energia/g, "Consumo consciente de energía"],
    [/Educação Ambiental/g, "Educación ambiental"],
    [/Fundamentos de Logística/g, "Fundamentos de logística"],
    [/Segurança no Trabalho/g, "Seguridad en el trabajo"],
    [/Legislação Trabalhista/g, "Legislación laboral"],
    [
      /Boas Práticas e Competências do SCRUM MASTER/g,
      "Buenas prácticas y competencias del SCRUM Master",
    ],
    [/Boas Práticas em PHP/g, "Buenas prácticas en PHP"],
    [/Gestão de Tecnologia de Informação/g, "Gestión de tecnologías de la información"],
    [/Matemática Financeira/g, "Matemática financiera"],
    [
      /BSC: Introdução à criação e execução da estratégia/g,
      "BSC: introducción a la creación y ejecución de la estrategia",
    ],
    [
      /Definições e objetivos da gestão de projetos/g,
      "Definiciones y objetivos de la gestión de proyectos",
    ],
    [/Fundamentos da Gestão de TI/g, "Fundamentos de gestión de TI"],
    [/Aprenda Markdown/g, "Aprende Markdown"],
    [/Inteligência Emocional no Trabalho/g, "Inteligencia emocional en el trabajo"],
    [/Criando páginas web com o GitHub Pages/g, "Creación de páginas web con GitHub Pages"],
    [/Produtividade máxima com VS Code/g, "Productividad máxima con VS Code"],
    [/ReactJS – Aprendendo Rápido/g, "ReactJS – aprendizaje rápido"],
    [
      /Curso React\.js Ninja: Módulo React \+ Webpack/g,
      "Curso React.js Ninja: módulo React + Webpack",
    ],
    [/Git e Git Hub para iniciantes/g, "Git y GitHub para principiantes"],
    [/Banco de Dados MySql/g, "Base de datos MySQL"],
    [
      /BLAST: Ferramenta de Alinhamentos Locais de Sequências/g,
      "BLAST: herramienta de alineación local de secuencias",
    ],
    [
      /GIMP: o editor de imagens gratuito para Windows Linux e Mac/g,
      "GIMP: editor de imágenes gratuito para Windows, Linux y Mac",
    ],
    [
      /Minicurso Qlikview do Zero – Introdução ao Qlik!/g,
      "Minicurso Qlikview desde cero – ¡introducción a Qlik!",
    ],
    [
      /Web Design: Construa Sites com PHP/g,
      "Diseño web: creación de sitios con PHP",
    ],
    [
      /Data Science: Visualização de dados com Python/g,
      "Data science: visualización de datos con Python",
    ],
    [/Criando sites estáticos com Jekyll/g, "Sitios estáticos con Jekyll"],
    [
      /Bootstrap 4: Completo e Direto ao Ponto \+ 7 Projetos/g,
      "Bootstrap 4: completo y directo + 7 proyectos",
    ],
    [
      /Criando um ambiente de Desenvolvimento no Windows/g,
      "Entorno de desarrollo en Windows",
    ],
    [
      /Git e contribuições para projetos Open Source/g,
      "Git y contribuciones a proyectos open source",
    ],
    [/React, Redux e integração de APIs/g, "React, Redux e integración de APIs"],
    [
      /Adobe XD: Design de Interfaces para Criação de Sites/g,
      "Adobe XD: diseño de interfaces para sitios web",
    ],
    [/Positividade e Inteligência Emocional/g, "Positividad e inteligencia emocional"],
    [/Conceitos básicos de C# para iniciantes/g, "Conceptos básicos de C# para principiantes"],
    [/Fundamentos do C# com Clean Code/g, "Fundamentos de C# con clean code"],
    [/HTML5 – Homologado pelo W3C/g, "HTML5 – validado por el W3C"],
    [/ASP\.NET MVC 5 Conceitos Básicos/g, "ASP.NET MVC 5 – conceptos básicos"],
    [/ASP\.NET MVC Intermediário/g, "ASP.NET MVC – intermedio"],
    [/ASP\.Net Core 2\.0 \(Trilha de Conhecimento\)/g, "ASP.NET Core 2.0 (itinerario formativo)"],
    [/MEAN Stack Development \(Trilha de Conhecimento\)/g, "Desarrollo MEAN stack (itinerario formativo)"],
    [/DevOps for Developers \(Trilha de Conhecimento\)/g, "DevOps para desarrolladores (itinerario formativo)"],
    [/Trilha de Conhecimento/g, "itinerario formativo"],
    [/Conceitos Ageis: SCRUM/g, "Conceptos ágiles: SCRUM"],
    [/II Workshop de Tecnologia da Fatec Mauá/g, "II Workshop de tecnología – Fatec Mauá"],
    [/I Semana da Tecnologia Fatec – Mauá/g, "I Semana de tecnología Fatec – Mauá"],
    [/III Workshop de Tecnologia da Fatec Mauá/g, "III Workshop de tecnología – Fatec Mauá"],
    [
      /II Semana de Tecnologia da Faculdade de Tecnologia Termomecanica/g,
      "II Semana de tecnología – Facultad de Tecnología Termomecánica",
    ],
    [
      /III Semana de Tecnologia da Faculdade de Tecnologia Termomecanica/g,
      "III Semana de tecnología – Facultad de Tecnología Termomecánica",
    ],
    [
      /IV Semana de Tecnologia da Faculdade de Tecnologia Termomecanica/g,
      "IV Semana de tecnología – Facultad de Tecnología Termomecánica",
    ],
    [/Expositor Thomas Greg & Sons/g, "expositor Thomas Greg & Sons"],
    [/Acessibilidade na Web, por Reinaldo Ferraz/g, "Accesibilidad web, por Reinaldo Ferraz"],
    [
      /Bluetalk: CI\/CD numa esteira DevOps Open, Escalável, em ‘casa’ com IBM Cloud Private/g,
      "Bluetalk: CI/CD en pipeline DevOps abierto y escalable on-premise con IBM Cloud Private",
    ],
    [
      /Meetup: Adicionando um paradigma funcional em sua caixa de ferramentas com Clojure/g,
      "Meetup: paradigma funcional en tu caja de herramientas con Clojure",
    ],
    [
      /Meetup: Javascript: Programação Funcional e ECMAScript 6/g,
      "Meetup: JavaScript – programación funcional y ECMAScript 6",
    ],
    [/Meetup: Arquitetura Clean Code/g, "Meetup: arquitectura Clean Code"],
    [/Palestra: Evolução Profissional e Pessoal/g, "Charla: evolución profesional y personal"],
    [/Webinar: DevOps: Docker e Kubernetes/g, "Webinar: DevOps – Docker y Kubernetes"],
    [/Webinar: DevOps: Quality gates no SonarQube/g, "Webinar: DevOps – quality gates en SonarQube"],
    [/Webinar: DevOps: Pipeline e RFC/g, "Webinar: DevOps – pipeline y RFC"],
    [/Webinar: DevOps: Vault e Consul/g, "Webinar: DevOps – Vault y Consul"],
    [/Webinar DevOps: Jenkins Jobs e AppStructure/g, "Webinar DevOps – Jenkins jobs y AppStructure"],
  ];
  for (const [re, rep] of pairs) t = t.replace(re, rep);

  t = t.replace(/(\s–\s\d{4}\s–\s)(\d+(?:,\d+)?)\s+Horas\b/g, "$1$2 horas");
  t = t.replace(/(\s–\s\d{4}\s–\s)1\s+Hora\b/g, "$11 hora");
  t = t.replace(/(\s–\s)(\d+(?:,\d+)?)\s+Horas$/g, "$1$2 horas");
  t = t.replace(/(\s)(\d+(?:,\d+)?)\s+Horas$/g, "$1$2 horas");
  t = t.replace(/(\s)1\s+Hora$/g, "$11 hora");
  return t;
}

export function localizeCourseLine(pt: string, locale: Locale): string {
  if (locale === "pt") return pt;
  if (locale === "en") return toEn(pt);
  return toEs(pt);
}

export type CourseItemPt = {
  pt: string;
  certificate_url?: string;
  /** Recording / external link (e.g. YouTube) for events */
  url?: string;
};
export type CourseGroupPt = {
  provider: string;
  url: string;
  items: CourseItemPt[];
};
export type CoursesDataPt = {
  distance: CourseGroupPt[];
  presential: CourseItemPt[];
  events: CourseItemPt[];
};
