const pt = {
  name: 'Nome',
  tel: 'Telefone',
  save: 'Salve',
  confirm: 'Confirme',
  cancel: 'Cancelar',
  delete: 'Excluir',
  complete: 'Terminar',
  loading: 'Carregando...',
  telEmpty: 'Por favor preencha o telefone',
  nameEmpty: 'Por favor, preencha seu nome',
  nameInvalid: 'Por favor insira o nome correto',
  confirmDelete: 'Tem certeza que deseja deletar',
  telInvalid: 'Por favor insira um número de telefone válido',
  vanCalendar: {
    end: 'Terminar',
    start: 'Começar',
    title: 'Seleção de data',
    confirm: 'Certo',
    startEnd: 'Começar/Terminar',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    monthTitle: (year, month) => `${year}/${month}`,
    rangePrompt: (maxRange) => `O número de dias selecionados não pode exceder ${maxRange} dias`,
  },
  vanCascader: {
    select: 'por favor escolha',
  },
  vanContactCard: {
    addText: 'Adicionar contatos',
  },
  vanContactList: {
    addText: 'Novo contato',
  },
  vanPagination: {
    prev: 'Página anterior',
    next: 'Próxima página',
  },
  vanPullRefresh: {
    pulling: 'Puxe para baixo para atualizar...',
    loosing: 'Solte para atualizar...',
  },
  vanSubmitBar: {
    label: 'total:',
  },
  vanCoupon: {
    unlimited: 'Sem limite de uso',
    discount: (discount) => `${discount} vezes`,
    condition: (condition) => `Disponível por mais de ${condition}`,
  },
  vanCouponCell: {
    title: 'cupom',
    tips: 'Não disponível',
    count: (count) => `${count} disponível`,
  },
  vanCouponList: {
    empty: 'Sem cupons',
    exchange: 'intercâmbio',
    close: 'Sem cupons',
    enable: 'Disponível',
    disabled: 'indisponível',
    placeholder: 'Por favor insira o código do cupom',
  },
  vanAddressEdit: {
    area: 'área',
    postal: 'Código postal',
    areaEmpty: 'Por favor selecione a região',
    addressEmpty: 'Por favor, preencha o endereço detalhado',
    postalEmpty: 'Formato de código postal incorreto',
    defaultAddress: 'Defina como endereço de entrega padrão',
    telPlaceholder: 'Número do celular do consignatário',
    namePlaceholder: 'Nome do consignado',
    areaPlaceholder: 'Selecione a província / cidade / distrito',
  },
  vanAddressEditDetail: {
    label: 'Endereço',
    placeholder: 'Número da rua, número do andar do quarto e outras informações',
  },
  vanAddressList: {
    add: 'Adicionar endereço',
  },
};

export default pt;