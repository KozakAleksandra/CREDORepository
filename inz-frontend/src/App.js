import './App.css';
import { Layout } from './components/Layout/Layout';
import {
    BrowserRouter, Routes,
    Route
} from "react-router-dom";
import { Home } from './pages/Home/Home';
import { Gallery } from './pages/Gallery/Gallery';
import { About } from './pages/About/About';
import { FAQ } from './pages/FAQ/FAQ';
import { WithStarBackground } from "./hoc/WithStarBackground"
import { MyGallery } from './pages/MyGallery/MyGallery';

const App = () => {

    return (
        <BrowserRouter>
            <Layout >
                <Routes>
                    <Route path="/" element={WithStarBackground(Home)} />
                    <Route path="gallery" element={<Gallery />} />
                    <Route path="about" element={WithStarBackground(About)} />
                    <Route path="faq" element={WithStarBackground(FAQ)} />
                    <Route path="my-gallery" element={<MyGallery />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default App;