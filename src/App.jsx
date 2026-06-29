import Sidebar from "./components/Sidebar/SidebarIndex"
import Content from "./components/Content/Content"
import MyListings from "./components/Content/MyListings/MyListings"

export default function App() {

  return (
    <>
      <Sidebar>
        <Sidebar.Logo>Guestspot app</Sidebar.Logo>
        <Sidebar.Profile>Vardenis Pavardenis</Sidebar.Profile>
        <Sidebar.Menu>
            <Sidebar.Menu.Item>My listings</Sidebar.Menu.Item>
            <Sidebar.Menu.Item>Browse</Sidebar.Menu.Item>
            <Sidebar.Menu.Item>Profile</Sidebar.Menu.Item>
        </Sidebar.Menu>
      </Sidebar>
      <Content>
        <MyListings />
      </Content>
    </>
  )
}