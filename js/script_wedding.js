// --- 1. 맛집 데이터 ---
const places = [
    {
        id: 0,
        name: "파티움하우스 순천",
        category: "wedding",
        lat: 34.974319, 
        lng: 127.483918,
        distance: "현재 위치",
        desc: "오늘의 예식장입니다. 와주셔서 감사합니다!",
        image: "img/partyum.jpg" 
    },
    {
        id: 1,
        name: "브루웍스",
        category: "cafe",
        lat: 34.944933,
        lng: 127.505244,
        distance: "차량 12분 (순천역 앞)",
        desc: "창고형 대형 카페. 기차 타기 전 친구들과 수다떨기 좋은 곳.",
        image: "img/brewworks.jpg"
    },
    {
        id: 2,
        name: "금빈회관",
        category: "meal",
        lat: 34.956621,
        lng: 127.487854,
        distance: "차량 7분",
        desc: "한정식 스타일의 돼지떡갈비. 반찬이 푸짐해 어른들이 좋아하세요.",
        image: "img/kumbin.jpg"
    },
    {
        id: 3,
        name: "조훈모과자점 팔마점",
        category: "gift",
        lat: 34.935012,
        lng: 127.510034, 
        distance: "차량 15분",
        desc: "순천 3대 빵집. 빈손으로 가기 아쉬울 때 선물용 빵 사가세요.",
        image: "img/bread.jpg"
    },
    {
        id: 4,
        name: "건봉국밥",
        category: "meal",
        lat: 34.945511,
        lng: 127.498022,
        distance: "차량 10분",
        desc: "아랫장 터줏대감. 해장이 필요하다면 무조건 여기입니다.",
        image: "img/gukbap.jpg"
    },
    {
        id: 5,
        name: "카페 앳더(At The)",
        category: "cafe",
        lat: 34.925123,
        lng: 127.515234,
        distance: "차량 20분",
        desc: "순천만 가는 길 논밭뷰가 예술. 주차가 넓고 편해요.",
        image: "img/cafe.jpg"
    }
];

// --- 2. 카드 생성 함수 ---
const container = document.getElementById('tiles-container');

function renderTiles(data) {
    container.innerHTML = '';
    data.forEach(place => {
        if(place.category === 'wedding') return; 

        let catLabel = place.category === 'meal' ? '맛집' : (place.category === 'cafe' ? '카페' : '선물');
        
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
    var mapOptions = {
        center: new naver.maps.LatLng(34.974319, 127.483918), 
        zoom: 13,
        scrollWheel: false, 
        scaleControl: false,
        mapDataControl: false
    };
    
    try {
        map = new naver.maps.Map('map', mapOptions);

        places.forEach(place => {
            let isWedding = place.category === 'wedding';
            let color = isWedding ? '#FF5555' : '#FF8C42';
            
            var marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(place.lat, place.lng),
                map: map,
                title: place.name,
                icon: {
                    content: `
                        <div style="
                            padding:8px 16px; background:${color}; color:white;
                            border-radius:30px; font-size:13px; font-weight:700;
                            box-shadow:0 3px 10px rgba(0,0,0,0.2); border:2px solid white;
                            white-space:nowrap; transform:translateY(-10px); cursor:pointer;
                        ">
                            ${isWedding ? '💒 ' : ''}${place.name}
                        </div>
                    `,
                    anchor: new naver.maps.Point(25, 25)
                }
            });
            
            naver.maps.Event.addListener(marker, 'click', function() {
                map.panTo(marker.getPosition());
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

renderTiles(places);
window.onload = function() {
    if(typeof naver !== 'undefined') initMap();
}
