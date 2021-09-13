/**
 * 越南语-vant ui
 */
const vi = {
  name: 'Tên',
  tel: 'Điện thoại',
  save: 'Cứu',
  confirm: 'Xác nhận',
  cancel: 'Hủy bỏ',
  delete: 'Xóa bỏ',
  complete: 'Hoàn thành',
  loading: 'Đang tải...',
  telEmpty: 'Vui lòng điền vào số điện thoại',
  nameEmpty: 'Vui lòng điền tên',
  nameInvalid: 'Tên không đúng định dạng',
  confirmDelete: 'Bạn có chắc chắn muốn xóa?',
  telInvalid: 'Số điện thoại không đúng định dạng',
  vanCalendar: {
    end: 'Kết thúc',
    start: 'Bắt đầu',
    title: 'Lịch',
    startEnd: 'Bắt đầu/Kết thúc',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    monthTitle: (year, month) => `${year}/${month}`,
    rangePrompt: maxRange => `Chọn không quá ${maxRange} ngày`,
  },
  vanContactCard: {
    addText: 'Thêm thông tin liên hệ',
  },
  vanContactList: {
    addText: 'Thêm liên hệ mới'
  },
  vanPagination: {
    prev: 'Trước',
    next: 'Kế tiếp',
  },
  vanPullRefresh: {
    pulling: 'Kéo để làm mới...',
    loosing: 'Lỏng lẻo để làm mới...',
  },
  vanSubmitBar: {
    label: 'Toàn bộ:',
  },
  vanCoupon: {
    unlimited: 'Vô hạn',
    discount: discount => `giảm giá ${discount * 10}`,
    condition: condition => `Ít nhất ${condition}`,
  },
  vanCouponCell: {
    title: 'Phiếu mua hàng',
    tips: 'Không có phiếu giảm giá',
    count: count => `Bạn có ${count} phiếu giảm giá`,
  },
  vanCouponList: {
    empty: 'Không có phiếu giảm giá',
    exchange: 'Trao đổi',
    close: 'Gần',
    enable: 'Có sẵn',
    disabled: 'Không có sẵn',
    placeholder: 'Mã giảm giá',
  },
  vanAddressEdit: {
    area: 'Khu vực',
    postal: 'Thuộc về bưu điện',
    areaEmpty: 'Vui lòng chọn khu vực nhận hàng',
    addressEmpty: 'Địa chỉ không được để trống',
    postalEmpty: 'Mã bưu điện sai',
    defaultAddress: 'Đặt làm địa chỉ mặc định',
    telPlaceholder: 'Điện thoại',
    namePlaceholder: 'Tên',
    areaPlaceholder: 'Khu vực',
  },
  vanAddressEditDetail: {
    label: 'Địa chỉ nhà',
    placeholder: 'Địa chỉ nhà',
  },
  vanAddressList: {
    add: 'thêm địa chỉ mới'
  }
}

export default vi;