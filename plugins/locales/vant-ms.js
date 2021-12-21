const ms = {
  name: 'Nama',
  tel: 'Telefon',
  save: 'Jimat',
  confirm: 'Confirm',
  cancel: 'Batal',
  delete: 'Padam',
  complete: 'Selesai',
  loading: 'Memuatkan...',
  telEmpty: 'Sila isikan telefon tersebut',
  nameEmpty: 'Sila isikan nama anda',
  nameInvalid: 'Sila masukkan nama yang betul',
  confirmDelete: 'Anda pasti anda mahu memadamkannya',
  telInvalid: 'sila masukkan nombor telefon yang sah',
  vanCalendar: {
    end: 'Selesai',
    start: 'Mulakan',
    title: 'Pemilihan tarikh',
    confirm: 'Pasti',
    startEnd: 'Mulakan/Selesai',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    monthTitle: (year, month) => `${year} ano ${month}月`,
    rangePrompt: maxRange => `Bilangan hari yang dipilih tidak boleh melebihi ${maxRange} hari`,
  },
  vanCascader: {
    select: 'Sila pilih',
  },
  vanContactCard: {
    addText: 'Tambah kenalan',
  },
  vanContactList: {
    addText: 'Kenalan baharu',
  },
  vanPagination: {
    prev: 'Halaman sebelumnya',
    next: 'Muka surat seterusnya',
  },
  vanPullRefresh: {
    pulling: 'Tarik ke bawah untuk menyegarkan...',
    loosing: 'Lepaskan untuk menyegarkan...',
  },
  vanSubmitBar: {
    label: 'Jumlah:',
  },
  vanCoupon: {
    unlimited: 'Tiada ambang penggunaan',
    discount: discount => `${discount} lipat`,
    condition: condition => `Tersedia melebihi ${condition}`,
  },
  vanCouponCell: {
    title: 'Kupon',
    tips: 'Tidak ada',
    count: (count) => `${count} tersedia`,
  },
  vanCouponList: {
    empty: 'Tiada kupon',
    exchange: 'Pertukaran',
    close: 'Tiada kupon',
    enable: 'Tersedia',
    disabled: 'Tidak tersedia',
    placeholder: 'Sila masukkan kod kupon',
  },
  vanAddressEdit: {
    area: 'kawasan',
    postal: 'Poskod',
    areaEmpty: 'Sila pilih kawasan',
    addressEmpty: 'Sila isikan alamat terperinci',
    postalEmpty: 'Format kod pos salah',
    defaultAddress: 'Tetapkan sebagai alamat penghantaran lalai',
    telPlaceholder: 'Nombor telefon bimbit penerima',
    namePlaceholder: 'Nama penerima',
    areaPlaceholder: 'Pilih provinsi/bandar/daerah',
  },
  vanAddressEditDetail: {
    label: 'Alamat',
    placeholder: 'Nombor rumah jalan, nombor bilik lantai dan maklumat lain',
  },
  vanAddressList: {
    add: 'Tambah alamat',
  },
};

export default ms;