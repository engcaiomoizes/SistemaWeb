-- CreateTable
CREATE TABLE `Niveis` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(30) NOT NULL,
    `administrador` BOOLEAN NOT NULL DEFAULT false,
    `cadastrar_usuarios` BOOLEAN NOT NULL DEFAULT false,
    `cadastrar_locais` BOOLEAN NOT NULL DEFAULT false,
    `cadastrar_tipos` BOOLEAN NOT NULL DEFAULT false,
    `cadastrar_patrimonios` BOOLEAN NOT NULL DEFAULT false,
    `cadastrar_niveis` BOOLEAN NOT NULL DEFAULT false,
    `cadastrar_ramais` BOOLEAN NOT NULL DEFAULT false,
    `cadastrar_updates` BOOLEAN NOT NULL DEFAULT false,
    `cadastrar_funcionarios` BOOLEAN NOT NULL DEFAULT false,
    `cadastrar_feriados` BOOLEAN NOT NULL DEFAULT false,
    `cadastrar_impressoras` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `login` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `cargo` VARCHAR(191) NULL,
    `nivel` VARCHAR(191) NULL,
    `foto` MEDIUMBLOB NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `welcome` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Usuarios_login_key`(`login`),
    INDEX `Usuarios_nivel_fkey`(`nivel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Locais` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `apelido` VARCHAR(191) NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `telefone_1` VARCHAR(191) NULL,
    `telefone_2` VARCHAR(191) NULL,
    `email_1` VARCHAR(191) NULL,
    `email_2` VARCHAR(191) NULL,
    `faixa_ip` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tipos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(40) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patrimonios` (
    `id` VARCHAR(191) NOT NULL,
    `tipo` INTEGER NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `num_patrimonio` INTEGER NULL,
    `orgao_patrimonio` VARCHAR(191) NULL,
    `medidas` VARCHAR(191) NULL,
    `largura` DOUBLE NULL,
    `altura` DOUBLE NULL,
    `comprimento` DOUBLE NULL,
    `raio` DOUBLE NULL,
    `diametro` DOUBLE NULL,
    `peso` DOUBLE NULL,
    `volume` DOUBLE NULL,
    `local` INTEGER NULL,
    `local_fisico` VARCHAR(191) NULL,
    `observacoes` VARCHAR(191) NULL,
    `novo` BOOLEAN NOT NULL DEFAULT false,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `baixado` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Patrimonios_tipo_fkey`(`tipo`),
    INDEX `Patrimonios_local_fkey`(`local`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fotos` (
    `id` VARCHAR(191) NOT NULL,
    `patrimonioId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `Fotos_patrimonio_fkey`(`patrimonioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sessions` (
    `id` VARCHAR(191) NOT NULL,
    `usuario` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `valid` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Sessions_usuario_fkey`(`usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ramais` (
    `id` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(5) NOT NULL,
    `nome` VARCHAR(20) NOT NULL,
    `setor` VARCHAR(20) NULL,
    `tipo` VARCHAR(10) NOT NULL DEFAULT 'analogico',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Updates` (
    `id` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(20) NOT NULL,
    `resumo` VARCHAR(191) NOT NULL,
    `notas` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario` VARCHAR(191) NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `detalhes` TINYTEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Logs_usuarios_fkey`(`usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notifications` (
    `id` VARCHAR(191) NOT NULL,
    `updateId` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transferencias` (
    `id` VARCHAR(191) NOT NULL,
    `patrimonioId` VARCHAR(191) NOT NULL,
    `localDe` INTEGER NULL,
    `localPara` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `observacoes` VARCHAR(191) NULL,

    INDEX `Transferencias_patrimonio_fkey`(`patrimonioId`),
    INDEX `Transferencias_localDe_fkey`(`localDe`),
    INDEX `Transferencias_localPara_fkey`(`localPara`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Welcomes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Funcionarios` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `rg` VARCHAR(20) NULL,
    `matricula` VARCHAR(20) NULL,
    `cargo` VARCHAR(191) NULL,
    `local` INTEGER NULL,
    `local_fisico` VARCHAR(191) NULL,
    `observacoes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feriados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` VARCHAR(10) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Impressoras` (
    `id` VARCHAR(191) NOT NULL,
    `marca` VARCHAR(30) NOT NULL,
    `modelo` VARCHAR(40) NOT NULL,
    `observacoes` VARCHAR(191) NULL,
    `localId` INTEGER NOT NULL,
    `ip_addr` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Laudos` (
    `id` VARCHAR(191) NOT NULL,
    `texto` TEXT NOT NULL,
    `autorId` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Baixas` (
    `id` VARCHAR(191) NOT NULL,
    `laudoId` VARCHAR(191) NULL,
    `memorando` VARCHAR(191) NULL,
    `observacoes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Itens` (
    `baixaId` VARCHAR(191) NOT NULL,
    `patrimonioId` VARCHAR(191) NOT NULL,
    `justificativa` VARCHAR(191) NULL,

    PRIMARY KEY (`baixaId`, `patrimonioId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Usuarios` ADD CONSTRAINT `Usuarios_nivel_fkey` FOREIGN KEY (`nivel`) REFERENCES `Niveis`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Patrimonios` ADD CONSTRAINT `Patrimonios_tipo_fkey` FOREIGN KEY (`tipo`) REFERENCES `Tipos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Patrimonios` ADD CONSTRAINT `Patrimonios_local_fkey` FOREIGN KEY (`local`) REFERENCES `Locais`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fotos` ADD CONSTRAINT `Fotos_patrimonioId_fkey` FOREIGN KEY (`patrimonioId`) REFERENCES `Patrimonios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sessions` ADD CONSTRAINT `Sessions_usuario_fkey` FOREIGN KEY (`usuario`) REFERENCES `Usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Logs` ADD CONSTRAINT `Logs_usuario_fkey` FOREIGN KEY (`usuario`) REFERENCES `Usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_updateId_fkey` FOREIGN KEY (`updateId`) REFERENCES `Updates`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transferencias` ADD CONSTRAINT `Transferencias_patrimonioId_fkey` FOREIGN KEY (`patrimonioId`) REFERENCES `Patrimonios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transferencias` ADD CONSTRAINT `Transferencias_localDe_fkey` FOREIGN KEY (`localDe`) REFERENCES `Locais`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transferencias` ADD CONSTRAINT `Transferencias_localPara_fkey` FOREIGN KEY (`localPara`) REFERENCES `Locais`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Funcionarios` ADD CONSTRAINT `Funcionarios_local_fkey` FOREIGN KEY (`local`) REFERENCES `Locais`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Impressoras` ADD CONSTRAINT `Impressoras_localId_fkey` FOREIGN KEY (`localId`) REFERENCES `Locais`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Laudos` ADD CONSTRAINT `Laudos_autorId_fkey` FOREIGN KEY (`autorId`) REFERENCES `Usuarios`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Baixas` ADD CONSTRAINT `Baixas_laudoId_fkey` FOREIGN KEY (`laudoId`) REFERENCES `Laudos`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Itens` ADD CONSTRAINT `Itens_baixaId_fkey` FOREIGN KEY (`baixaId`) REFERENCES `Baixas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Itens` ADD CONSTRAINT `Itens_patrimonioId_fkey` FOREIGN KEY (`patrimonioId`) REFERENCES `Patrimonios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
