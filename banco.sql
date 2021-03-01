create database ordo_realitas
default character set utf8
default collate utf8_general_ci;

use ordo_realitas;

create table visitantes(
	id_visitante int auto_increment,
    nome_visitante varchar(100),
    email_visitante varchar(100),
    cpf_visitante varchar(15),
    senha_visitante varchar(200),
    estado_visitante varchar(20) default "Em Analise",
    data_cadastro_visitante datetime default CURRENT_TIMESTAMP,
	
    primary key(id_visitante)
);

create table recrutamento(
	id_recrutamento int auto_increment,
    respondido_recrutamento tinyint(1) default "0",
    texto_recrutamento text,
    data_recrutamento_visitante datetime default CURRENT_TIMESTAMP,
    id_visitante_fk int,
    
    primary key(id_recrutamento),
    foreign key(id_visitante_fk) references visitantes(id_visitante)
);

create table ajuda(
	id_ajuda int auto_increment,
    respondido_ajuda tinyint(1) default "0",
    texto_ajuda text,
    data_ajuda_visitante datetime default CURRENT_TIMESTAMP,
    id_visitante_fk int,
    
    primary key(id_ajuda),
    foreign key(id_visitante_fk) references visitantes(id_visitante)
);

insert into visitantes(nome_visitante) value ('teste');