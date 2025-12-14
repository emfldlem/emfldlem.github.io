// --- 1. 장소 데이터 (카페 위주 구성) ---
const places = [
    {
        id: 0,
        name: "파티움하우스 (예식장)",
        category: "wedding",
        lat: 34.974319, 
        lng: 127.483918,
        distance: "현재 위치",
        desc: "결혼식이 열리는 곳입니다. 여기서 출발!",
        image: "img/partyum.jpg" 
    },
    {
        id: 1,
        name: "카페 바빌라 (Vavilla)",
        category: "cafe",
        lat: 34.968500,  // 문화예술회관 근처
        lng: 127.485200,
        distance: "차량 3분 (가장 가까움)",
        desc: "식장에서 제일 가까운 예쁜 정원 카페. 차분하게 대화하기 좋습니다.",
        image: "img/vavilla.jpg"
    },
    {
        id: 2,
        name: "밀림슈퍼",
        category: "cafe",
        lat: 34.957500,
        lng: 127.485500,
        distance: "차량 5분",
        desc: "옛날 슈퍼를 개조한 뉴트로 감성 카페. 사진 찍기 좋아하는 친구들에게 추천!",
        image: "img/milim.jpg"
    },
    {
        id: 3,
        name: "브루웍스",
        category: "cafe",
        lat: 34.944933,
        lng: 127.505244,
        distance: "차량 10분 (순천역 앞)",
        desc: "순천에서 가장 핫한 창고형 대형 카페. 기차 타기 전 들르기 딱입니다.",
        image: "img/brewworks.jpg"
    },
    {
        id: 4,
        name: "카페 앳더 (At The)",
        category: "cafe",
        lat: 34.925123,
        lng: 127.515234,
        distance: "차량 15분 (순천만 방향)",
        desc: "논밭 뷰가 예술인 힐링 카페. 주차장이 넓어서 편해요.",
        image: "img/cafe.jpg"
    },
    // (맛집도 필요하면 아래처럼 남겨두세요. 필터 버튼을 위해 하나는 남기는 게 좋습니다)
    {
        id: 5,
        name: "금빈회관",
        category: "meal",
        lat: 34.956621,
        lng: 127.487854,
        distance: "차량 6분",
        desc: "한정식 스타일의 돼지떡갈비. 든든한 식사가 필요하다면 여기!",
        image: "img/kumbin.jpg"
    }
];

// --- 2. 카드 생성 함수 ---
const container = document.getElementById('tiles-container');

function renderTiles(data) {
    container.innerHTML = '';
    data.forEach(place => {
        if(place.category === 'wedding') return; 

        // 카테고리 한글 명칭
        let catLabel = "";
        if(place.category === 'meal') catLabel = "🍚 맛집";
        else if(place.category === 'cafe') catLabel = "☕ 카페";
        else catLabel = "🎁 선물";
        
        const html = `
            <article class="tile" onclick="moveToMap(${place.lat}, ${place.lng})">
                <div class="image">
                    <img src="${place.image}" alt="${place.name}" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'"/>
                </div>
                <div class="tag-row">${place.distance} &bull; ${catLabel}</div>
                <h2>${place.name}</h2>
                <div class="content">
                    <p>${place.desc}</p>
                </div>
            </article>
        `;
        container.innerHTML += html;
    });
}

// --- 3. 필터 기능 ---
function filterData(cat) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    
    if(cat === 'all') renderTiles(places);
    else renderTiles(places.filter(p => p.category === cat));
}

// --- 4. 지도 로직 ---
let map = null;

function initMap() {
    // 식장(파티움하우스)을 중심으로 지도 시작
    var mapOptions = {
        center: new naver.maps.LatLng(34.974319, 127.483918), 
        zoom: 13, // 주변 카페가 보이도록 줌 레벨 조정
        scrollWheel: false, 
        scaleControl: false,
        mapDataControl: false
    };
    
    try {
        map = new naver.maps.Map('map', mapOptions);

        places.forEach(place => {
            let isWedding = place.category === 'wedding';
            // 예식장은 빨강(#FF5555), 나머지는 오렌지(#FF8C42)
            let color = isWedding ? '#FF5555' : '#FF8C42';
            // z-index: 예식장 마커를 제일 위로 올림
            let zIndex = isWedding ? 100 : 1; 
            
            var marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(place.lat, place.lng),
                map: map,
                zIndex: zIndex,
                title: place.name,
                icon: {
                    content: `
                        <div style="
                            padding:8px 14px; background:${color}; color:white;
                            border-radius:20px; font-size:13px; font-weight:700;
                            box-shadow:0 3px 6px rgba(0,0,0,0.3); border:2px solid white;
                            white-space:nowrap; transform:translateY(-10px); cursor:pointer;
                            display: flex; align-items: center; gap: 4px;
                        ">
                            ${isWedding ? '💒 ' : '☕ '}${place.name}
                        </div>
                    `,
                    anchor: new naver.maps.Point(25, 25)
                }
            });
            
            naver.maps.Event.addListener(marker, 'click', function() {
                map.morph(marker.getPosition(), 15); // 부드럽게 이동 및 줌
            });
        });
    } catch (e) {
        console.error("지도 로드 실패: API 키(ncpKeyId)를 확인해주세요.");
    }
}

function moveToMap(lat, lng) {
    if(map) {
        map.morph(new naver.maps.LatLng(lat, lng), 15);
        document.getElementById('header').scrollIntoView({ behavior: 'smooth' });
    }
}

window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if(window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

// 시작할 때 전체 리스트 보여줌
renderTiles(places);

// 페이지 로드 완료 시 지도 실행
window.onload = function() {
    if(typeof naver !== 'undefined') initMap();
}
