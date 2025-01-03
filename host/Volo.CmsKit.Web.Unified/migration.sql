IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [AbpAuditLogs] (
    [Id] uniqueidentifier NOT NULL,
    [ApplicationName] nvarchar(96) NULL,
    [UserId] uniqueidentifier NULL,
    [UserName] nvarchar(256) NULL,
    [TenantId] uniqueidentifier NULL,
    [TenantName] nvarchar(64) NULL,
    [ImpersonatorUserId] uniqueidentifier NULL,
    [ImpersonatorUserName] nvarchar(256) NULL,
    [ImpersonatorTenantId] uniqueidentifier NULL,
    [ImpersonatorTenantName] nvarchar(64) NULL,
    [ExecutionTime] datetime2 NOT NULL,
    [ExecutionDuration] int NOT NULL,
    [ClientIpAddress] nvarchar(64) NULL,
    [ClientName] nvarchar(128) NULL,
    [ClientId] nvarchar(64) NULL,
    [CorrelationId] nvarchar(64) NULL,
    [BrowserInfo] nvarchar(512) NULL,
    [HttpMethod] nvarchar(16) NULL,
    [Url] nvarchar(256) NULL,
    [Exceptions] nvarchar(max) NULL,
    [Comments] nvarchar(256) NULL,
    [HttpStatusCode] int NULL,
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    CONSTRAINT [PK_AbpAuditLogs] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AbpBlobContainers] (
    [Id] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [Name] nvarchar(128) NOT NULL,
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    CONSTRAINT [PK_AbpBlobContainers] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AbpClaimTypes] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(256) NOT NULL,
    [Required] bit NOT NULL,
    [IsStatic] bit NOT NULL,
    [Regex] nvarchar(512) NULL,
    [RegexDescription] nvarchar(128) NULL,
    [Description] nvarchar(256) NULL,
    [ValueType] int NOT NULL,
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    CONSTRAINT [PK_AbpClaimTypes] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AbpFeatureGroups] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(128) NOT NULL,
    [DisplayName] nvarchar(256) NOT NULL,
    [ExtraProperties] nvarchar(max) NULL,
    CONSTRAINT [PK_AbpFeatureGroups] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AbpFeatures] (
    [Id] uniqueidentifier NOT NULL,
    [GroupName] nvarchar(128) NOT NULL,
    [Name] nvarchar(128) NOT NULL,
    [ParentName] nvarchar(128) NULL,
    [DisplayName] nvarchar(256) NOT NULL,
    [Description] nvarchar(256) NULL,
    [DefaultValue] nvarchar(256) NULL,
    [IsVisibleToClients] bit NOT NULL,
    [IsAvailableToHost] bit NOT NULL,
    [AllowedProviders] nvarchar(256) NULL,
    [ValueType] nvarchar(2048) NULL,
    [ExtraProperties] nvarchar(max) NULL,
    CONSTRAINT [PK_AbpFeatures] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AbpFeatureValues] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(128) NOT NULL,
    [Value] nvarchar(128) NOT NULL,
    [ProviderName] nvarchar(64) NULL,
    [ProviderKey] nvarchar(64) NULL,
    CONSTRAINT [PK_AbpFeatureValues] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AbpLinkUsers] (
    [Id] uniqueidentifier NOT NULL,
    [SourceUserId] uniqueidentifier NOT NULL,
    [SourceTenantId] uniqueidentifier NULL,
    [TargetUserId] uniqueidentifier NOT NULL,
    [TargetTenantId] uniqueidentifier NULL,
    CONSTRAINT [PK_AbpLinkUsers] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AbpOrganizationUnits] (
    [Id] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [ParentId] uniqueidentifier NULL,
    [Code] nvarchar(95) NOT NULL,
    [DisplayName] nvarchar(128) NOT NULL,
    [EntityVersion] int NOT NULL,
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    [CreationTime] datetime2 NOT NULL,
    [CreatorId] uniqueidentifier NULL,
    [LastModificationTime] datetime2 NULL,
    [LastModifierId] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL DEFAULT CAST(0 AS bit),
    [DeleterId] uniqueidentifier NULL,
    [DeletionTime] datetime2 NULL,
    CONSTRAINT [PK_AbpOrganizationUnits] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AbpOrganizationUnits_AbpOrganizationUnits_ParentId] FOREIGN KEY ([ParentId]) REFERENCES [AbpOrganizationUnits] ([Id])
);
GO

CREATE TABLE [AbpPermissionGrants] (
    [Id] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [Name] nvarchar(128) NOT NULL,
    [ProviderName] nvarchar(64) NOT NULL,
    [ProviderKey] nvarchar(64) NOT NULL,
    CONSTRAINT [PK_AbpPermissionGrants] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AbpPermissionGroups] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(128) NOT NULL,
    [DisplayName] nvarchar(256) NOT NULL,
    [ExtraProperties] nvarchar(max) NULL,
    CONSTRAINT [PK_AbpPermissionGroups] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AbpPermissions] (
    [Id] uniqueidentifier NOT NULL,
    [GroupName] nvarchar(128) NOT NULL,
    [Name] nvarchar(128) NOT NULL,
    [ParentName] nvarchar(128) NULL,
    [DisplayName] nvarchar(256) NOT NULL,
    [IsEnabled] bit NOT NULL,
    [MultiTenancySide] tinyint NOT NULL,
    [Providers] nvarchar(128) NULL,
    [StateCheckers] nvarchar(256) NULL,
    [ExtraProperties] nvarchar(max) NULL,
    CONSTRAINT [PK_AbpPermissions] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AbpRoles] (
    [Id] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [Name] nvarchar(256) NOT NULL,
    [NormalizedName] nvarchar(256) NOT NULL,
    [IsDefault] bit NOT NULL,
    [IsStatic] bit NOT NULL,
    [IsPublic] bit NOT NULL,
    [EntityVersion] int NOT NULL,
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    CONSTRAINT [PK_AbpRoles] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AbpSecurityLogs] (
    [Id] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [ApplicationName] nvarchar(96) NULL,
    [Identity] nvarchar(96) NULL,
    [Action] nvarchar(96) NULL,
    [UserId] uniqueidentifier NULL,
    [UserName] nvarchar(256) NULL,
    [TenantName] nvarchar(64) NULL,
    [ClientId] nvarchar(64) NULL,
    [CorrelationId] nvarchar(64) NULL,
    [ClientIpAddress] nvarchar(64) NULL,
    [BrowserInfo] nvarchar(512) NULL,
    [CreationTime] datetime2 NOT NULL,
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    CONSTRAINT [PK_AbpSecurityLogs] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AbpSettingDefinitions] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(128) NOT NULL,
    [DisplayName] nvarchar(256) NOT NULL,
    [Description] nvarchar(512) NULL,
    [DefaultValue] nvarchar(256) NULL,
    [IsVisibleToClients] bit NOT NULL,
    [Providers] nvarchar(128) NULL,
    [IsInherited] bit NOT NULL,
    [IsEncrypted] bit NOT NULL,
    [ExtraProperties] nvarchar(max) NULL,
    CONSTRAINT [PK_AbpSettingDefinitions] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AbpSettings] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(128) NOT NULL,
    [Value] nvarchar(2048) NOT NULL,
    [ProviderName] nvarchar(64) NULL,
    [ProviderKey] nvarchar(64) NULL,
    CONSTRAINT [PK_AbpSettings] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AbpTenants] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(64) NOT NULL,
    [EntityVersion] int NOT NULL,
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    [CreationTime] datetime2 NOT NULL,
    [CreatorId] uniqueidentifier NULL,
    [LastModificationTime] datetime2 NULL,
    [LastModifierId] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL DEFAULT CAST(0 AS bit),
    [DeleterId] uniqueidentifier NULL,
    [DeletionTime] datetime2 NULL,
    CONSTRAINT [PK_AbpTenants] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AbpUserDelegations] (
    [Id] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [SourceUserId] uniqueidentifier NOT NULL,
    [TargetUserId] uniqueidentifier NOT NULL,
    [StartTime] datetime2 NOT NULL,
    [EndTime] datetime2 NOT NULL,
    CONSTRAINT [PK_AbpUserDelegations] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AbpUsers] (
    [Id] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [UserName] nvarchar(256) NOT NULL,
    [NormalizedUserName] nvarchar(256) NOT NULL,
    [Name] nvarchar(64) NULL,
    [Surname] nvarchar(64) NULL,
    [Email] nvarchar(256) NOT NULL,
    [NormalizedEmail] nvarchar(256) NOT NULL,
    [EmailConfirmed] bit NOT NULL DEFAULT CAST(0 AS bit),
    [PasswordHash] nvarchar(256) NULL,
    [SecurityStamp] nvarchar(256) NOT NULL,
    [IsExternal] bit NOT NULL DEFAULT CAST(0 AS bit),
    [PhoneNumber] nvarchar(16) NULL,
    [PhoneNumberConfirmed] bit NOT NULL DEFAULT CAST(0 AS bit),
    [IsActive] bit NOT NULL,
    [TwoFactorEnabled] bit NOT NULL DEFAULT CAST(0 AS bit),
    [LockoutEnd] datetimeoffset NULL,
    [LockoutEnabled] bit NOT NULL DEFAULT CAST(0 AS bit),
    [AccessFailedCount] int NOT NULL DEFAULT 0,
    [ShouldChangePasswordOnNextLogin] bit NOT NULL,
    [EntityVersion] int NOT NULL,
    [LastPasswordChangeTime] datetimeoffset NULL,
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    [CreationTime] datetime2 NOT NULL,
    [CreatorId] uniqueidentifier NULL,
    [LastModificationTime] datetime2 NULL,
    [LastModifierId] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL DEFAULT CAST(0 AS bit),
    [DeleterId] uniqueidentifier NULL,
    [DeletionTime] datetime2 NULL,
    CONSTRAINT [PK_AbpUsers] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [CmsBlogFeatures] (
    [Id] uniqueidentifier NOT NULL,
    [BlogId] uniqueidentifier NOT NULL,
    [FeatureName] nvarchar(64) NOT NULL,
    [IsEnabled] bit NOT NULL,
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    [CreationTime] datetime2 NOT NULL,
    [CreatorId] uniqueidentifier NULL,
    [LastModificationTime] datetime2 NULL,
    [LastModifierId] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL DEFAULT CAST(0 AS bit),
    [DeleterId] uniqueidentifier NULL,
    [DeletionTime] datetime2 NULL,
    CONSTRAINT [PK_CmsBlogFeatures] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [CmsBlogs] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(64) NOT NULL,
    [Slug] nvarchar(64) NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    [CreationTime] datetime2 NOT NULL,
    [CreatorId] uniqueidentifier NULL,
    [LastModificationTime] datetime2 NULL,
    [LastModifierId] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL DEFAULT CAST(0 AS bit),
    [DeleterId] uniqueidentifier NULL,
    [DeletionTime] datetime2 NULL,
    CONSTRAINT [PK_CmsBlogs] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [CmsBox] (
    [Id] uniqueidentifier NOT NULL,
    [Section] nvarchar(25) NOT NULL,
    [Title] nvarchar(50) NULL,
    [Action] nvarchar(25) NULL,
    [ActionUrl] nvarchar(100) NULL,
    [Summary] nvarchar(100) NULL,
    [Status] int NOT NULL,
    [Description] nvarchar(512) NULL,
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    [CreationTime] datetime2 NOT NULL,
    [CreatorId] uniqueidentifier NULL,
    [LastModificationTime] datetime2 NULL,
    [LastModifierId] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL DEFAULT CAST(0 AS bit),
    [DeleterId] uniqueidentifier NULL,
    [DeletionTime] datetime2 NULL,
    CONSTRAINT [PK_CmsBox] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [CmsComments] (
    [Id] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [EntityType] nvarchar(64) NOT NULL,
    [EntityId] nvarchar(64) NOT NULL,
    [Text] nvarchar(512) NOT NULL,
    [RepliedCommentId] uniqueidentifier NULL,
    [CreatorId] uniqueidentifier NOT NULL,
    [CreationTime] datetime2 NOT NULL,
    [Url] nvarchar(512) NULL,
    [IdempotencyToken] nvarchar(32) NULL,
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    CONSTRAINT [PK_CmsComments] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [CmsEntityTags] (
    [TagId] uniqueidentifier NOT NULL,
    [EntityId] nvarchar(450) NOT NULL,
    [TenantId] uniqueidentifier NULL,
    CONSTRAINT [PK_CmsEntityTags] PRIMARY KEY ([EntityId], [TagId])
);
GO

CREATE TABLE [CmsGlobalResources] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(128) NOT NULL,
    [Value] nvarchar(max) NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    [CreationTime] datetime2 NOT NULL,
    [CreatorId] uniqueidentifier NULL,
    [LastModificationTime] datetime2 NULL,
    [LastModifierId] uniqueidentifier NULL,
    CONSTRAINT [PK_CmsGlobalResources] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [CmsImages] (
    [Id] uniqueidentifier NOT NULL,
    [Description] nvarchar(512) NOT NULL,
    [CoverImageMediaId] uniqueidentifier NOT NULL,
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    [CreationTime] datetime2 NOT NULL,
    [CreatorId] uniqueidentifier NULL,
    CONSTRAINT [PK_CmsImages] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [CmsMediaDescriptors] (
    [Id] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [EntityType] nvarchar(64) NOT NULL,
    [Name] nvarchar(255) NOT NULL,
    [MimeType] nvarchar(128) NOT NULL,
    [Size] bigint NOT NULL,
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    [CreationTime] datetime2 NOT NULL,
    [CreatorId] uniqueidentifier NULL,
    [LastModificationTime] datetime2 NULL,
    [LastModifierId] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL DEFAULT CAST(0 AS bit),
    [DeleterId] uniqueidentifier NULL,
    [DeletionTime] datetime2 NULL,
    CONSTRAINT [PK_CmsMediaDescriptors] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [CmsMenuItems] (
    [Id] uniqueidentifier NOT NULL,
    [ParentId] uniqueidentifier NULL,
    [DisplayName] nvarchar(64) NOT NULL,
    [IsActive] bit NOT NULL,
    [Url] nvarchar(1024) NOT NULL,
    [Icon] nvarchar(max) NULL,
    [Order] int NOT NULL,
    [Target] nvarchar(max) NULL,
    [ElementId] nvarchar(max) NULL,
    [CssClass] nvarchar(max) NULL,
    [PageId] uniqueidentifier NULL,
    [TenantId] uniqueidentifier NULL,
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    [CreationTime] datetime2 NOT NULL,
    [CreatorId] uniqueidentifier NULL,
    [LastModificationTime] datetime2 NULL,
    [LastModifierId] uniqueidentifier NULL,
    CONSTRAINT [PK_CmsMenuItems] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [CmsPages] (
    [Id] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [Title] nvarchar(256) NOT NULL,
    [Slug] nvarchar(256) NOT NULL,
    [Content] nvarchar(max) NULL,
    [Script] nvarchar(max) NULL,
    [Style] nvarchar(max) NULL,
    [IsHomePage] bit NOT NULL,
    [EntityVersion] int NOT NULL,
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    [CreationTime] datetime2 NOT NULL,
    [CreatorId] uniqueidentifier NULL,
    [LastModificationTime] datetime2 NULL,
    [LastModifierId] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL DEFAULT CAST(0 AS bit),
    [DeleterId] uniqueidentifier NULL,
    [DeletionTime] datetime2 NULL,
    CONSTRAINT [PK_CmsPages] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [CmsRatings] (
    [Id] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [EntityType] nvarchar(64) NOT NULL,
    [EntityId] nvarchar(64) NOT NULL,
    [StarCount] smallint NOT NULL,
    [CreatorId] uniqueidentifier NOT NULL,
    [CreationTime] datetime2 NOT NULL,
    CONSTRAINT [PK_CmsRatings] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [CmsTags] (
    [Id] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [EntityType] nvarchar(64) NOT NULL,
    [Name] nvarchar(32) NOT NULL,
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    [CreationTime] datetime2 NOT NULL,
    [CreatorId] uniqueidentifier NULL,
    [LastModificationTime] datetime2 NULL,
    [LastModifierId] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL DEFAULT CAST(0 AS bit),
    [DeleterId] uniqueidentifier NULL,
    [DeletionTime] datetime2 NULL,
    CONSTRAINT [PK_CmsTags] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [CmsUserReactions] (
    [Id] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [EntityType] nvarchar(64) NOT NULL,
    [EntityId] nvarchar(64) NOT NULL,
    [ReactionName] nvarchar(32) NOT NULL,
    [CreatorId] uniqueidentifier NOT NULL,
    [CreationTime] datetime2 NOT NULL,
    CONSTRAINT [PK_CmsUserReactions] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [CmsUsers] (
    [Id] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [UserName] nvarchar(256) NOT NULL,
    [Email] nvarchar(256) NOT NULL,
    [Name] nvarchar(64) NULL,
    [Surname] nvarchar(64) NULL,
    [IsActive] bit NOT NULL,
    [EmailConfirmed] bit NOT NULL DEFAULT CAST(0 AS bit),
    [PhoneNumber] nvarchar(16) NULL,
    [PhoneNumberConfirmed] bit NOT NULL DEFAULT CAST(0 AS bit),
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    CONSTRAINT [PK_CmsUsers] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AbpAuditLogActions] (
    [Id] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [AuditLogId] uniqueidentifier NOT NULL,
    [ServiceName] nvarchar(256) NULL,
    [MethodName] nvarchar(128) NULL,
    [Parameters] nvarchar(2000) NULL,
    [ExecutionTime] datetime2 NOT NULL,
    [ExecutionDuration] int NOT NULL,
    [ExtraProperties] nvarchar(max) NULL,
    CONSTRAINT [PK_AbpAuditLogActions] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AbpAuditLogActions_AbpAuditLogs_AuditLogId] FOREIGN KEY ([AuditLogId]) REFERENCES [AbpAuditLogs] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AbpEntityChanges] (
    [Id] uniqueidentifier NOT NULL,
    [AuditLogId] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [ChangeTime] datetime2 NOT NULL,
    [ChangeType] tinyint NOT NULL,
    [EntityTenantId] uniqueidentifier NULL,
    [EntityId] nvarchar(128) NULL,
    [EntityTypeFullName] nvarchar(128) NOT NULL,
    [ExtraProperties] nvarchar(max) NULL,
    CONSTRAINT [PK_AbpEntityChanges] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AbpEntityChanges_AbpAuditLogs_AuditLogId] FOREIGN KEY ([AuditLogId]) REFERENCES [AbpAuditLogs] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AbpBlobs] (
    [Id] uniqueidentifier NOT NULL,
    [ContainerId] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [Name] nvarchar(256) NOT NULL,
    [Content] varbinary(max) NULL,
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    CONSTRAINT [PK_AbpBlobs] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AbpBlobs_AbpBlobContainers_ContainerId] FOREIGN KEY ([ContainerId]) REFERENCES [AbpBlobContainers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AbpOrganizationUnitRoles] (
    [RoleId] uniqueidentifier NOT NULL,
    [OrganizationUnitId] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [CreationTime] datetime2 NOT NULL,
    [CreatorId] uniqueidentifier NULL,
    CONSTRAINT [PK_AbpOrganizationUnitRoles] PRIMARY KEY ([OrganizationUnitId], [RoleId]),
    CONSTRAINT [FK_AbpOrganizationUnitRoles_AbpOrganizationUnits_OrganizationUnitId] FOREIGN KEY ([OrganizationUnitId]) REFERENCES [AbpOrganizationUnits] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AbpOrganizationUnitRoles_AbpRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AbpRoles] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AbpRoleClaims] (
    [Id] uniqueidentifier NOT NULL,
    [RoleId] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [ClaimType] nvarchar(256) NOT NULL,
    [ClaimValue] nvarchar(1024) NULL,
    CONSTRAINT [PK_AbpRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AbpRoleClaims_AbpRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AbpRoles] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AbpTenantConnectionStrings] (
    [TenantId] uniqueidentifier NOT NULL,
    [Name] nvarchar(64) NOT NULL,
    [Value] nvarchar(1024) NOT NULL,
    CONSTRAINT [PK_AbpTenantConnectionStrings] PRIMARY KEY ([TenantId], [Name]),
    CONSTRAINT [FK_AbpTenantConnectionStrings_AbpTenants_TenantId] FOREIGN KEY ([TenantId]) REFERENCES [AbpTenants] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AbpUserClaims] (
    [Id] uniqueidentifier NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [ClaimType] nvarchar(256) NOT NULL,
    [ClaimValue] nvarchar(1024) NULL,
    CONSTRAINT [PK_AbpUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AbpUserClaims_AbpUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AbpUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AbpUserLogins] (
    [UserId] uniqueidentifier NOT NULL,
    [LoginProvider] nvarchar(64) NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [ProviderKey] nvarchar(196) NOT NULL,
    [ProviderDisplayName] nvarchar(128) NULL,
    CONSTRAINT [PK_AbpUserLogins] PRIMARY KEY ([UserId], [LoginProvider]),
    CONSTRAINT [FK_AbpUserLogins_AbpUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AbpUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AbpUserOrganizationUnits] (
    [UserId] uniqueidentifier NOT NULL,
    [OrganizationUnitId] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [CreationTime] datetime2 NOT NULL,
    [CreatorId] uniqueidentifier NULL,
    CONSTRAINT [PK_AbpUserOrganizationUnits] PRIMARY KEY ([OrganizationUnitId], [UserId]),
    CONSTRAINT [FK_AbpUserOrganizationUnits_AbpOrganizationUnits_OrganizationUnitId] FOREIGN KEY ([OrganizationUnitId]) REFERENCES [AbpOrganizationUnits] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AbpUserOrganizationUnits_AbpUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AbpUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AbpUserRoles] (
    [UserId] uniqueidentifier NOT NULL,
    [RoleId] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    CONSTRAINT [PK_AbpUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AbpUserRoles_AbpRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AbpRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AbpUserRoles_AbpUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AbpUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AbpUserTokens] (
    [UserId] uniqueidentifier NOT NULL,
    [LoginProvider] nvarchar(64) NOT NULL,
    [Name] nvarchar(128) NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [Value] nvarchar(max) NULL,
    CONSTRAINT [PK_AbpUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AbpUserTokens_AbpUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AbpUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [CmsBoxItems] (
    [Id] uniqueidentifier NOT NULL,
    [BoxId] uniqueidentifier NOT NULL,
    [MediaId] uniqueidentifier NULL,
    [Title] nvarchar(50) NULL,
    [Action] nvarchar(25) NULL,
    [ActionUrl] nvarchar(100) NULL,
    [Summary] nvarchar(100) NULL,
    [Icon] nvarchar(25) NULL,
    [Description] nvarchar(1024) NULL,
    [EntityVersion] int NOT NULL,
    [CreationTime] datetime2 NOT NULL,
    [CreatorId] uniqueidentifier NULL,
    [LastModificationTime] datetime2 NULL,
    [LastModifierId] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL DEFAULT CAST(0 AS bit),
    [DeleterId] uniqueidentifier NULL,
    [DeletionTime] datetime2 NULL,
    CONSTRAINT [PK_CmsBoxItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CmsBoxItems_CmsBox_BoxId] FOREIGN KEY ([BoxId]) REFERENCES [CmsBox] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [CmsBlogPosts] (
    [Id] uniqueidentifier NOT NULL,
    [BlogId] uniqueidentifier NOT NULL,
    [Title] nvarchar(64) NOT NULL,
    [Slug] nvarchar(256) NOT NULL,
    [ShortDescription] nvarchar(256) NULL,
    [Content] nvarchar(max) NULL,
    [CoverImageMediaId] uniqueidentifier NULL,
    [TenantId] uniqueidentifier NULL,
    [AuthorId] uniqueidentifier NOT NULL,
    [Status] int NOT NULL,
    [EntityVersion] int NOT NULL,
    [ExtraProperties] nvarchar(max) NOT NULL,
    [ConcurrencyStamp] nvarchar(40) NOT NULL,
    [CreationTime] datetime2 NOT NULL,
    [CreatorId] uniqueidentifier NULL,
    [LastModificationTime] datetime2 NULL,
    [LastModifierId] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL DEFAULT CAST(0 AS bit),
    [DeleterId] uniqueidentifier NULL,
    [DeletionTime] datetime2 NULL,
    CONSTRAINT [PK_CmsBlogPosts] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CmsBlogPosts_CmsUsers_AuthorId] FOREIGN KEY ([AuthorId]) REFERENCES [CmsUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AbpEntityPropertyChanges] (
    [Id] uniqueidentifier NOT NULL,
    [TenantId] uniqueidentifier NULL,
    [EntityChangeId] uniqueidentifier NOT NULL,
    [NewValue] nvarchar(512) NULL,
    [OriginalValue] nvarchar(512) NULL,
    [PropertyName] nvarchar(128) NOT NULL,
    [PropertyTypeFullName] nvarchar(64) NOT NULL,
    CONSTRAINT [PK_AbpEntityPropertyChanges] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AbpEntityPropertyChanges_AbpEntityChanges_EntityChangeId] FOREIGN KEY ([EntityChangeId]) REFERENCES [AbpEntityChanges] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_AbpAuditLogActions_AuditLogId] ON [AbpAuditLogActions] ([AuditLogId]);
GO

CREATE INDEX [IX_AbpAuditLogActions_TenantId_ServiceName_MethodName_ExecutionTime] ON [AbpAuditLogActions] ([TenantId], [ServiceName], [MethodName], [ExecutionTime]);
GO

CREATE INDEX [IX_AbpAuditLogs_TenantId_ExecutionTime] ON [AbpAuditLogs] ([TenantId], [ExecutionTime]);
GO

CREATE INDEX [IX_AbpAuditLogs_TenantId_UserId_ExecutionTime] ON [AbpAuditLogs] ([TenantId], [UserId], [ExecutionTime]);
GO

CREATE INDEX [IX_AbpBlobContainers_TenantId_Name] ON [AbpBlobContainers] ([TenantId], [Name]);
GO

CREATE INDEX [IX_AbpBlobs_ContainerId] ON [AbpBlobs] ([ContainerId]);
GO

CREATE INDEX [IX_AbpBlobs_TenantId_ContainerId_Name] ON [AbpBlobs] ([TenantId], [ContainerId], [Name]);
GO

CREATE INDEX [IX_AbpEntityChanges_AuditLogId] ON [AbpEntityChanges] ([AuditLogId]);
GO

CREATE INDEX [IX_AbpEntityChanges_TenantId_EntityTypeFullName_EntityId] ON [AbpEntityChanges] ([TenantId], [EntityTypeFullName], [EntityId]);
GO

CREATE INDEX [IX_AbpEntityPropertyChanges_EntityChangeId] ON [AbpEntityPropertyChanges] ([EntityChangeId]);
GO

CREATE UNIQUE INDEX [IX_AbpFeatureGroups_Name] ON [AbpFeatureGroups] ([Name]);
GO

CREATE INDEX [IX_AbpFeatures_GroupName] ON [AbpFeatures] ([GroupName]);
GO

CREATE UNIQUE INDEX [IX_AbpFeatures_Name] ON [AbpFeatures] ([Name]);
GO

CREATE UNIQUE INDEX [IX_AbpFeatureValues_Name_ProviderName_ProviderKey] ON [AbpFeatureValues] ([Name], [ProviderName], [ProviderKey]) WHERE [ProviderName] IS NOT NULL AND [ProviderKey] IS NOT NULL;
GO

CREATE UNIQUE INDEX [IX_AbpLinkUsers_SourceUserId_SourceTenantId_TargetUserId_TargetTenantId] ON [AbpLinkUsers] ([SourceUserId], [SourceTenantId], [TargetUserId], [TargetTenantId]) WHERE [SourceTenantId] IS NOT NULL AND [TargetTenantId] IS NOT NULL;
GO

CREATE INDEX [IX_AbpOrganizationUnitRoles_RoleId_OrganizationUnitId] ON [AbpOrganizationUnitRoles] ([RoleId], [OrganizationUnitId]);
GO

CREATE INDEX [IX_AbpOrganizationUnits_Code] ON [AbpOrganizationUnits] ([Code]);
GO

CREATE INDEX [IX_AbpOrganizationUnits_ParentId] ON [AbpOrganizationUnits] ([ParentId]);
GO

CREATE UNIQUE INDEX [IX_AbpPermissionGrants_TenantId_Name_ProviderName_ProviderKey] ON [AbpPermissionGrants] ([TenantId], [Name], [ProviderName], [ProviderKey]) WHERE [TenantId] IS NOT NULL;
GO

CREATE UNIQUE INDEX [IX_AbpPermissionGroups_Name] ON [AbpPermissionGroups] ([Name]);
GO

CREATE INDEX [IX_AbpPermissions_GroupName] ON [AbpPermissions] ([GroupName]);
GO

CREATE UNIQUE INDEX [IX_AbpPermissions_Name] ON [AbpPermissions] ([Name]);
GO

CREATE INDEX [IX_AbpRoleClaims_RoleId] ON [AbpRoleClaims] ([RoleId]);
GO

CREATE INDEX [IX_AbpRoles_NormalizedName] ON [AbpRoles] ([NormalizedName]);
GO

CREATE INDEX [IX_AbpSecurityLogs_TenantId_Action] ON [AbpSecurityLogs] ([TenantId], [Action]);
GO

CREATE INDEX [IX_AbpSecurityLogs_TenantId_ApplicationName] ON [AbpSecurityLogs] ([TenantId], [ApplicationName]);
GO

CREATE INDEX [IX_AbpSecurityLogs_TenantId_Identity] ON [AbpSecurityLogs] ([TenantId], [Identity]);
GO

CREATE INDEX [IX_AbpSecurityLogs_TenantId_UserId] ON [AbpSecurityLogs] ([TenantId], [UserId]);
GO

CREATE UNIQUE INDEX [IX_AbpSettingDefinitions_Name] ON [AbpSettingDefinitions] ([Name]);
GO

CREATE UNIQUE INDEX [IX_AbpSettings_Name_ProviderName_ProviderKey] ON [AbpSettings] ([Name], [ProviderName], [ProviderKey]) WHERE [ProviderName] IS NOT NULL AND [ProviderKey] IS NOT NULL;
GO

CREATE INDEX [IX_AbpTenants_Name] ON [AbpTenants] ([Name]);
GO

CREATE INDEX [IX_AbpUserClaims_UserId] ON [AbpUserClaims] ([UserId]);
GO

CREATE INDEX [IX_AbpUserLogins_LoginProvider_ProviderKey] ON [AbpUserLogins] ([LoginProvider], [ProviderKey]);
GO

CREATE INDEX [IX_AbpUserOrganizationUnits_UserId_OrganizationUnitId] ON [AbpUserOrganizationUnits] ([UserId], [OrganizationUnitId]);
GO

CREATE INDEX [IX_AbpUserRoles_RoleId_UserId] ON [AbpUserRoles] ([RoleId], [UserId]);
GO

CREATE INDEX [IX_AbpUsers_Email] ON [AbpUsers] ([Email]);
GO

CREATE INDEX [IX_AbpUsers_NormalizedEmail] ON [AbpUsers] ([NormalizedEmail]);
GO

CREATE INDEX [IX_AbpUsers_NormalizedUserName] ON [AbpUsers] ([NormalizedUserName]);
GO

CREATE INDEX [IX_AbpUsers_UserName] ON [AbpUsers] ([UserName]);
GO

CREATE INDEX [IX_CmsBlogPosts_AuthorId] ON [CmsBlogPosts] ([AuthorId]);
GO

CREATE INDEX [IX_CmsBlogPosts_Slug_BlogId] ON [CmsBlogPosts] ([Slug], [BlogId]);
GO

CREATE INDEX [IX_CmsBox_Section_Status] ON [CmsBox] ([Section], [Status]);
GO

CREATE INDEX [IX_CmsBoxItems_BoxId] ON [CmsBoxItems] ([BoxId]);
GO

CREATE INDEX [IX_CmsComments_TenantId_EntityType_EntityId] ON [CmsComments] ([TenantId], [EntityType], [EntityId]);
GO

CREATE INDEX [IX_CmsComments_TenantId_RepliedCommentId] ON [CmsComments] ([TenantId], [RepliedCommentId]);
GO

CREATE INDEX [IX_CmsEntityTags_TenantId_EntityId_TagId] ON [CmsEntityTags] ([TenantId], [EntityId], [TagId]);
GO

CREATE INDEX [IX_CmsPages_TenantId_Slug] ON [CmsPages] ([TenantId], [Slug]);
GO

CREATE INDEX [IX_CmsRatings_TenantId_EntityType_EntityId_CreatorId] ON [CmsRatings] ([TenantId], [EntityType], [EntityId], [CreatorId]);
GO

CREATE INDEX [IX_CmsTags_TenantId_Name] ON [CmsTags] ([TenantId], [Name]);
GO

CREATE INDEX [IX_CmsUserReactions_TenantId_CreatorId_EntityType_EntityId_ReactionName] ON [CmsUserReactions] ([TenantId], [CreatorId], [EntityType], [EntityId], [ReactionName]);
GO

CREATE INDEX [IX_CmsUserReactions_TenantId_EntityType_EntityId_ReactionName] ON [CmsUserReactions] ([TenantId], [EntityType], [EntityId], [ReactionName]);
GO

CREATE INDEX [IX_CmsUsers_TenantId_Email] ON [CmsUsers] ([TenantId], [Email]);
GO

CREATE INDEX [IX_CmsUsers_TenantId_UserName] ON [CmsUsers] ([TenantId], [UserName]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20240611145350_Init-WithOut-Ids', N'8.0.1');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CmsBoxItems]') AND [c].[name] = N'Title');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [CmsBoxItems] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [CmsBoxItems] ALTER COLUMN [Title] nvarchar(200) NULL;
GO

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CmsBoxItems]') AND [c].[name] = N'Summary');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [CmsBoxItems] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [CmsBoxItems] ALTER COLUMN [Summary] nvarchar(500) NULL;
GO

DECLARE @var2 sysname;
SELECT @var2 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CmsBox]') AND [c].[name] = N'Title');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [CmsBox] DROP CONSTRAINT [' + @var2 + '];');
ALTER TABLE [CmsBox] ALTER COLUMN [Title] nvarchar(200) NULL;
GO

DECLARE @var3 sysname;
SELECT @var3 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CmsBox]') AND [c].[name] = N'Summary');
IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [CmsBox] DROP CONSTRAINT [' + @var3 + '];');
ALTER TABLE [CmsBox] ALTER COLUMN [Summary] nvarchar(500) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20240611165949_Added-Box', N'8.0.1');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [CmsBoxItems] ADD [ExtraProperties] nvarchar(max) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20240613084142_Edited-Box', N'8.0.1');
GO

COMMIT;
GO

