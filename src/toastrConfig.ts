import 'toastr/build/toastr.css'
import toastr from 'toastr'

toastr.options = {
  closeButton: true,
  debug: false,
  positionClass: 'toast-top-right',
  onclick: undefined,
  showDuration: 200,
  hideDuration: 1000,
  timeOut: 5000,
  extendedTimeOut: 1000,
  showEasing: 'swing',
  hideEasing: 'linear',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut'
};

export default toastr;
