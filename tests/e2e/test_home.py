from playwright.sync_api import Page
def test_home_title(page: Page, base_url: str = "http://localhost:8080"):
    page.goto(base_url + "/")
    assert page.title()  # non-empty
