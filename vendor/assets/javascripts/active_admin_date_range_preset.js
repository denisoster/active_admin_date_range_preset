function num_with_leading_zero(num, digitsCount = 2) {
  let s = num + '';
  while (s.length < digitsCount) {
    s = '0' + s;
  }
  return s;
}

function formatDate(date) {
  let str = date.getFullYear() + '-' + num_with_leading_zero(date.getMonth() + 1) + '-' + num_with_leading_zero(date.getDate());
  if (opts.show_time) {
    str += (' ' + num_with_leading_zero(date.getHours()) + ':' + num_with_leading_zero(date.getMinutes()) + ':' + num_with_leading_zero(date.getSeconds()));
  }
  return str;
}

function unbindClickEventBlockTimerange() {
  document.querySelectorAll('.block_timerange').forEach(function (el) {
    el.remove();
  });
  document.body.removeEventListener('click', CalendarRangeSet);
}

let opts = {
  hours_offset: 0,
  date_to_human_readable: false,
  show_time: false,
  add_range: []
};

document.addEventListener('DOMContentLoaded', function () {


  let pairs = document.querySelectorAll('.datetime_preset_pair');
  pairs.forEach(function (pair) {
    init(pair)
  });

  document.querySelectorAll('form.filter_form div.filter_date_time_range').forEach(function (element) {
    init(element)
  });

});

function CalendarRangeSet(e) {
  e.stopPropagation();
  if (!e.target.closest('.block_timerange')) {
    unbindClickEventBlockTimerange();
  }
}

function fillInputs(start, end, gteqInput, lteqInput) {
  gteqInput.value = formatDate(start);
  if (opts.date_to_human_readable) {
    end.setTime(end.getTime() - 1000);
  }
  lteqInput.value = formatDate(end);
}

function init(pair) {
  let datetime = new Date();
  let mainBtnHtml = '<a href="#" class="btn_timerange">Set range</a>';
  let label = pair.querySelector('label');
  label.classList.add('datetime_preset_filter_label');
  label.insertAdjacentHTML('afterend', mainBtnHtml);

  let btnTimeRange = pair.querySelector('.btn_timerange');
  btnTimeRange.addEventListener('click', function (e) {
    unbindClickEventBlockTimerange();
    e.stopPropagation();
    e.preventDefault();

    let rangeElement = e.target.parentElement.querySelectorAll('input');
    let gteqInput = rangeElement[0]; // From
    let lteqInput = rangeElement[1]; // To

    let additionalItemsHtml = '';
    opts.add_range.forEach(function (el, i) {
      additionalItemsHtml += '<div><span class="btn_date_range_' + i + '">' + el['title'] + '</span></div>';
    });

    let blockTimeRange = document.createElement('div');
    blockTimeRange.style.minWidth = e.target.offsetWidth + 'px';
    blockTimeRange.style.top = e.pageY - e.target.offsetTop + 'px';
    blockTimeRange.style.left = e.pageX - e.target.offsetLeft + 'px';
    blockTimeRange.classList.add('block_timerange');
    blockTimeRange.innerHTML = `
        <div><span class="btn_today">Today</span></div>
        <div><span class="btn_yesterday">Yesterday</span></div>
        <div><span class="btn_week">This Week</span></div>
        <div><span class="btn_month">This Month</span></div>
        <div><span class="btn_last_week">Last Week</span></div>
        <div><span class="btn_last_month">Last Month</span></div>
        ${additionalItemsHtml}
      `;

    document.body.appendChild(blockTimeRange);

    let container = blockTimeRange;

    opts.add_range.forEach(function (el, i) {
      container.querySelector('.btn_date_range_' + i).addEventListener('click', function (e) {
        unbindClickEventBlockTimerange();
        let start = new Date(el['start'].getFullYear(), el['start'].getMonth(), el['start'].getDate());
        let end = new Date(el['end'].getFullYear(), el['end'].getMonth(), el['end'].getDate());
        fillInputs(start, end, gteqInput, lteqInput);
      });
    });

    container.querySelector('.btn_today').addEventListener('click', function (e) {
      unbindClickEventBlockTimerange();
      let start = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate());
      let end = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() + 1);
      fillInputs(start, end, gteqInput, lteqInput);
    });

    container.querySelector('.btn_yesterday').addEventListener('click', function (e) {
      unbindClickEventBlockTimerange();
      let start = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() - 1);
      let end = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate());
      fillInputs(start, end, gteqInput, lteqInput);
    });

    container.querySelector('.btn_week').addEventListener('click', function (e) {
      unbindClickEventBlockTimerange();
      let start = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() - datetime.getDay() + 1);
      let end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7);
      fillInputs(start, end, gteqInput, lteqInput);
    });

    container.querySelector('.btn_month').addEventListener('click', function (e) {
      unbindClickEventBlockTimerange();
      let start = new Date(datetime.getFullYear(), datetime.getMonth(), 1);
      let end = new Date(datetime.getFullYear(), datetime.getMonth() + 1, 1);
      fillInputs(start, end, gteqInput, lteqInput);
    });

    container.querySelector('.btn_last_week').addEventListener('click', function (e) {
      unbindClickEventBlockTimerange();
      let end = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() - datetime.getDay() + 1);
      let start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 7);
      fillInputs(start, end, gteqInput, lteqInput);
    });

    container.querySelector('.btn_last_month').addEventListener('click', function (e) {
      unbindClickEventBlockTimerange();
      let end = new Date(datetime.getFullYear(), datetime.getMonth(), 1);
      let start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
      fillInputs(start, end, gteqInput, lteqInput);
    });

    document.body.addEventListener('click', CalendarRangeSet);

  });
}