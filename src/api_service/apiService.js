import { xmlToJson } from "./xml2json";

const API_URL = "ErmctInfoInqireService";
// 병원 응급실 실시간 가용병상정보 조회 오퍼레이션
const NO_1 = "/getEmrrmRltmUsefulSckbdInfoInqire";
// service key
const NO_5 = "/getEgytBassInfoInqire";
const API_KEY =
  "7eTdXpvji1tanllfyqPZ%2BMsf%2BM1v1gTbz4N0dsNyFEhV17ahp%2F2n1LYqSMy129Jjc5BTFnNo8vVRYlJOgKzsBw%3D%3D";

function sum(a, b) {
  let num = 0;
  if (a !== undefined && b !== undefined) {
    num = parseInt(a, 10) + parseInt(b, 10);
  }
  // hvs03만 있는 경우
  else if (a !== undefined) {
    num = parseInt(a, 10);
  }
  // hv29만 있는 경우
  else if (b !== undefined) {
    num = parseInt(b, 10);
  }
  // hvs03와 hv29 데이터가 모두 없는 경우, hv01을 0으로 설정할 수도 있습니다.
  else {
    num = 0;
  }
  return num;
}
function check(a) {
  let num = 0;
  if (a !== undefined) {
    num = parseInt(a, 10);
    return num;
  } else return num;
}

export const CallAvail_beds = async () => {
  let avail_beds = [];
  const reqURL = `${API_URL}${NO_1}?serviceKey=${API_KEY}&pageNo=1&numOfRows=1000`; // 데이터 개수 총 412개 (실행 속도를 위해 줄임)
  const response = await fetch(reqURL);
  const xmlString = await response.text();
  let XmlNode = new DOMParser().parseFromString(xmlString, "text/xml");
  var objson = xmlToJson(XmlNode).response.body.items.item;
  objson.forEach((data) => {
    let item = {};
    item.dutyname = data.dutyName;
    item.dutytel3 = data.dutyTel3;
    item.hv01 = sum(data.hvs03, data.hv29); //응급실 음압 격리 병상
    item.hv02 = sum(data.hvs04, data.hv30); //응급실 일반 격리 병상
    item.hv03 = check(data.hvs05); // [응급전용] 중환자실_기준
    item.hv04 = sum(data.hvs10, data.hv33); //[응급전용] 소아중환자실
    item.hv05 = sum(data.hvs19, data.hv36); //[응급전용] 입원실
    item.hv06 = sum(data.hvs20, data.hv33); //[응급전용] 소아입원실
    item.hv07 = sum(data.hvs50, data.hv17); //[응급전용] 중환자실 음압격리
    item.hv08 = sum(data.hvs51, data.hv18); //[응급전용] 중환자실 일반격리
    item.hv09 = sum(data.hvs52, data.hv19); //[응급전용] 입원실 음압격리
    item.hv10 = sum(data.hvs53, data.hv21); //[응급전용] 일반격리_기준
    avail_beds.push(item);
  });
  console.log(avail_beds);
  return avail_beds;
};

//주소 및 진료 과목
export const CallDetails = async () => {
  let details = [];
  const reqURL = `${API_URL}${NO_5}?serviceKey=${API_KEY}&pageNo=1&numOfRows=1000`; // 데이터 개수 총 412개 (실행 속도를 위해 줄임)
  const response = await fetch(reqURL);
  const xmlString = await response.text();
  let XmlNode = new DOMParser().parseFromString(xmlString, "text/xml");
  var objson = xmlToJson(XmlNode).response.body.items.item;
  objson.forEach((data) => {
    let item = {};
    item.dutyname = data.dutyName; //기관명
    item.dutyTel1 = data.dutyTel1; //대표전화
    item.dutyTel3 = data.dutyTel3; //응급실전화 (없으면 응급실 X)
    item.dgidIdName = data.dgidIdName; //  진료과목
    item.dutyAddr = data.dutyAddr; // 주소
    item.dutyTime1s = data.dutyTime1s; // 평일 오픈시간
    item.dutyTime1c = data.dutyTime1c; // 평일 마감시간
    item.dutyTime6s = data.dutyTime6s; // 토욜 오픈시간
    item.dutyTime6c = data.dutyTime6c; // 토욜 마감시간
    item.dutyHayn = data.dutyHayn; //입원실 가용여부
    item.dutyHano = data.dutyHano; //병상수
    item.dutyEryn = data.dutyEryn; // 응급실 운영여부 => 1 운영 , 2 운영X
    details.push(item);
  });
  console.log(details);
  return details;
};