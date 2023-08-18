import * as React from "react";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

function Title() {
  return (
    <div className="title">
      <h1>-변재정-</h1>
      <p>프론트엔드 개발자 포트폴리오!</p>
      <p>안녕하세요 프론트엔드 개발자 준비생 변재정입니다.</p>
      <Button variant="primary" className="morebtn">
        더 알아보기 ↓
      </Button>{" "}
    </div>
  );
}

//html 렌더링
const IndexPage = () => {
  return (
    <article>
      <div className="background">
        <nav className="navbar">
          <div className="navbar_logo">
            <img
              src="https://cdn-icons-png.flaticon.com/128/3242/3242120.png"
              className="portpolio_logo"
            ></img>
            <a href="#">BJJ's Portfolio</a>
          </div>

          <ul className="navbar_menu">
            <li>
              <a href="#">About Me</a>
            </li>
            <li>
              <a href="#">Skills</a>
            </li>
            <li>
              <a href="#">Archiving</a>
            </li>
            <li>
              <a href="#">Projects</a>
            </li>
            <li>
              <a href="#">Career</a>
            </li>
          </ul>

          <ul className="navbar_icons">
            <li>
              <a href="https://github.com/BoubleJ/Portpolio.git">
                <img src="https://cdn-icons-png.flaticon.com/128/11104/11104255.png"></img>
              </a>
            </li>
            <li>
              <a href="#">
                <img src="https://cdn-icons-png.flaticon.com/128/1384/1384063.png"></img>
              </a>
            </li>
          </ul>

          <a href="#" className="navbar_toggleBtn">
            <img src="https://cdn-icons-png.flaticon.com/128/8867/8867520.png"></img>
          </a>
        </nav>

        <header>
          <Title></Title>
        </header>
      </div>
      <div className="uparrow">
        <img src="https://cdn-icons-png.flaticon.com/128/626/626075.png"></img>
      </div>

      <section>
        <main className="main">
          <p className="sectiontitle">
            <a href="#">ABOUT ME</a>
          </p>
          <hr></hr>
          <table>
            <tr>
              <td>
                <div className="name">
                  <p>이름</p>
                  <p>변재정</p>
                </div>
              </td>
              <td>
                <div className="name">
                  <p>생년월일</p>
                  <p>96.01.10</p>
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="name">
                  <div>
                    <p>주소지</p>
                    <p>경기도 용인시</p>
                  </div>
                </div>
              </td>
              <td>
                <div className="name">
                  <p>연락처</p>
                  <p>010-5096-6940</p>
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="name">
                  <p>이메일</p>
                  <p>dogmnil2007@naver.com</p>
                </div>
              </td>
              <td>
                <div className="name">
                  <p>학력</p>
                  <p>가천대학교</p>
                </div>
              </td>
            </tr>
          </table>
        </main>
      </section>
      <section>
        <main className="main skillbox">
          <p className="sectiontitle">
            <a href="#">Skills</a>
          </p>
          <hr></hr>
          <div className="frontbox">
            <p style={{ color: "#F4623A" }}>Front-end</p>
            <hr></hr>
            <div>
              <img src="https://cdn-icons-png.flaticon.com/128/5968/5968267.png"></img>
              <img src="https://cdn-icons-png.flaticon.com/128/5968/5968242.png"></img>
            </div>
            <div>
              <img src="https://cdn-icons-png.flaticon.com/128/5968/5968292.png"></img>

              <img src="https://cdn-icons-png.flaticon.com/128/919/919851.png"></img>
            </div>
          </div>

          <div className="frontbox">
            <p style={{ color: "#F4623A" }}>Front-end</p>
            <hr></hr>
            <div>
              <img src="https://cdn-icons-png.flaticon.com/128/5968/5968267.png"></img>
              <img src="https://cdn-icons-png.flaticon.com/128/5968/5968242.png"></img>
            </div>
            <div>
              <img src="https://cdn-icons-png.flaticon.com/128/5968/5968292.png"></img>

              <img src="https://cdn-icons-png.flaticon.com/128/919/919851.png"></img>
            </div>
          </div>
          
        </main>
      </section>
      <section>
        <main className="main archiving">
          <p className="sectiontitle">
            <a href="#">Archiving</a>
          </p>
          <hr></hr>
        </main>
      </section>
      <section>
        <main className="main projects">
          <p className="sectiontitle">
            <a href="#">Projects</a>
          </p>
          <hr></hr>
        </main>
      </section>
      <section>
        <main className="main career">
          <p className="sectiontitle">
            <a href="#">Career</a>
          </p>
          <hr></hr>
        </main>
      </section>

      <footer></footer>
    </article>
  );
};

export default IndexPage;

//주소 이름
export const Head = () => <title>T아카데미 Gatsby 포트폴리오</title>;
