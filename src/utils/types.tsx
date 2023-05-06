// contexts
export interface IUserContext{
    user: any,
    userType: string,
    sidebar: {
        active: boolean,
        label: string
    },
    isSuper: boolean,
    isAdmin: boolean,
    loading: boolean,
    getUser(id: any): any,
    setUserType(n: string): void,
    setSidebar(a: boolean, l: string): void,
    isLoggedIn(): boolean,
    getUserType(): string;
}

export interface IResourceContext{
    banks: Array<any>,
    locations: Array<any>,
    countries: Array<any>,
    country: any,
    ipData: any,
    loading: boolean,
    getBanks(limit: number): any,
    getLocations(): any,
    getCountries(limit: number): any,
    getIpAddress(): any
}

export interface IBlogContext{
    overview: any,
    graph: Array<{
        dates: Array<string>,
        end: string,
        start: string,
        total: number,
        value: number,
        week: string
    }>,
    subscribers: Array<any>,
    subscriber: any,
    campaigns: Array<any>,
    sections: Array<any>,
    campaign: any,
    brackets: Array<any>,
    bracket: any,
    posts: Array<any>,
    latest: Array<any>,
    filtered: Array<any>,
    post: any,
    tags: Array<any>,
    formatted: Array<any>,
    tag: any,
    categories: Array<any>,
    category: any,
    comments: Array<any>,
    comment: any,
    postType: string,
    tagType: string,
    catType: string,
    total: number,
    count: number,
    pagination: IPagination,
    loading: boolean,
    response: IResponse
    logout(): void,
    getOverview(id: string, date: string): Promise<void>,
    getPosts(limit: number, page: number): void,
    getLatestPosts(): void,
    getAllPosts(limit: number, page: number): void,
    getUserPosts(limit: number, page: number, id: string): void,
    getPost(id: string): void,
    getPostBySlug(slug: string, preview: boolean): void,
    getBrackets(limit: number, page: number): void,
    getAllBrackets(limit: number, page: number): void,
    getUserBrackets(limit: number, page: number, id: string): void,
    getBracket(id: string): void,
    getBracketPosts(limit: number, page: number, id: string): void,
    getCategories(limit: number, page: number): void,
    getAllCategories(limit: number, page: number): void,
    getUserCategories(limit: number, page: number, id: string): void,
    getCategory(id: string): void,
    getCategoryPosts(limit: number, page: number, id: string): void,
    getTags(limit: number, page: number): void,
    getAllTags(limit: number, page: number): void,
    getUserTags(limit: number, page: number, id: string): void,
    getTag(id: string): void,
    getTagPosts(limit: number, page: number,id: string): void,
    getSubscribers(limit: number, page: number): void,
    getSubscriber(id: string): void,
    getCampaigns(limit: number, page: number): void,
    getAllCampaigns(limit: number, page: number): void,
    getUserCampaigns(limit: number, page: number, id: string): void,
    getCampaign(id: string): void,
    getCampaignByCode(code: string): void,
    setLoading(): void,
    unsetLoading(): void,
    setPosts(data: Array<any>): void,
    setFiltered(data: Array<any>): void,
    setFormatted(data: Array<any>): void,
    setSections(data: Array<any>): void,
    setTypes(t: string, v:string): void
}

export interface IResponse{
    error: boolean,
    errors: Array<any>,
    total: number,
    count: number,
    pagination: IPagination,
    message: string,
    data: any,
    status: number
}

export interface IPagination {
    next: { page: number, limit: number },
	prev: { page: number, limit: number },
}

export interface IPlaceholder{
    className: string,
    height: string,
    bgColor: string,
    width: string,
    minWidth: string,
    minHeight: string,
    animate: boolean,
    radius: string | number
}

export interface ISEOProps{
    pageTitle: string,
    type: string,
    url: string,
    title: string,
    description: string,
    language: string,
    image: string,
    author: {
        email: string,
        name: string,
        image:string
    },
    site: {
        siteName: string,
        searchUrl: string
    },
    keywords: string
}

export interface IDLayoutProps{
    Component: any,
    pageTitle: string,
    showBack: boolean,
    collapsed: boolean,
    children: any
}

export interface ISidebarProps{
    barCollapsed: boolean | undefined,
    collapsed: boolean | undefined,
    expandSidebar(e: any): void
}

export interface ITopbarProps{
    isFixed: boolean,
    pageTitle: string,
    showBack: boolean,
    barType: string,
    collapsed: boolean,
    barCollapsed: boolean,
    expandFunc: any
}

export interface IDropSelectProps{
    placeholder: string,
    options: any,
    onChange: any,
    focus: boolean,
    className: string,
    isDisabled: boolean,
    defaultValue: any,
    controlDisplayImage: boolean,
    optionDisplayImage: boolean,
    controlDisplayLabel: boolean,
    optionDisplayLabel: boolean,
    controlDisplayLeft: boolean,
    disableSeparator: boolean | undefined,
    menuPosition: string,
    isSearchable: boolean,
    optionDisplayLeft: boolean,
    menuBackground: string,
}

export interface IDropSelectState{
    options: Array<any>,
    selected: {
        value: string,
        label:  string,
        left: string,
        image: string,
    },
    isOpen: boolean,
    placeholder: string | undefined
}

export interface IErrorUIProps{
    error: any
    reset: any
}

export interface IAlertProps{
    show: boolean,
    message: string,
    type: string
}

export interface ILottieProps{
    lottieData: any,
    width: string | number,
    height: string | number,
    loop: boolean
}

export interface IMessageCompProps{
    title: string, 
    message: string, 
    action: any, 
    status: string, 
    lottieSize: string | number, 
    loop: boolean, 
    actionType: string, 
    buttonText: string, 
    setBg: boolean, 
    bgColor: string,
    buttonPosition: string, 
    slim: boolean, 
    slimer: boolean, 
    className: string,
    displayTitle: boolean,
    displayMessage: string,
    titleColor: string,
    messageColor: string
}

/*
    Modals
*/
export interface IModalProps{
    isShow: boolean,
    cover: boolean,
    closeModal: any, 
    modalTitle: string | undefined, 
    flattened: boolean, 
    stretch: boolean, 
    slim: string
}

export interface IAlertModal extends IModalProps{
    type: string,
    data: {
        buttonText: string,
        title: string,
        message: string
    }
}

export interface IDoneModal extends IModalProps{
    type: string,
    data: {
        buttonText: string,
        title: string,
        message: string,
        actionType: string,
        action: any
    }
}

export interface IDeletePostModal extends IModalProps{
    data: any,
    type: string
}

export interface IDetailsModal extends IModalProps{
    data: any,
    type: string
}

export interface IDeleteSubModal extends IModalProps{
    data: any,
    type: string
}

export interface ICropModal extends IModalProps{
    data: any,
    capture: any,
    imageLoaded: any,
    cropType: any
}

export interface IDropDownProps{
    options: any, 
    className: string, 
    selected: any, 
    defaultValue: any, 
    placeholder: string, 
    search: boolean, 
    displayImage: boolean, 
    displayControlLeft: boolean, 
    displayOptionLeft: boolean, 
    displayLabel: boolean, 
    displayOptionLabel: boolean,
    disabled: boolean,
    position: string,
    menuBg: string 
}

export interface INavbarProps{
    isFixed: boolean, 
    backgroundColor: string, 
    doScroll: any,
    display: string
}

export interface IPostBarProps extends INavbarProps{
    post: any,
    share: {
        twitter: boolean,
        whatsapp: boolean,
        telegram: boolean,
        facebook: boolean,
        discord: boolean,
        linkedin: boolean
    }
}

export interface IToastProps{
    show: boolean, 
    close: any, 
    title: string, 
    message: string, 
    type: string, 
    position: string
}

export interface IVerificationProps {
    status: any,
    userId: string
}

export interface IFooterProps{
    bgColor: string,
    className: string,
}

export interface ISelectBox{
    placeholder: string,
    options(): Array<ISelectBoxOption>,
    onChange(data: ISelectBoxOption): void
}

export interface ISelectBoxOption{
    value: string,
    label: string,
    image: string,
    left: string
}

export interface IPostComp{
    title: string,
    position: string,
    bracket: string,
    category: string,
    comments: number | string,
    likes: number | string,
    date: any,
    author: string,
    thumbnail: string,
    url: string,
    post: any
}

export interface IPostArticle {
    image: string
    title: string,
    titleColor: string,
    dashboard: boolean
    date: string,
    url: string,
    size: string,
    loading: boolean,
    target: string
}

export interface ILatestBlob {
    image: string
    title: string,
    titleColor: string,
    dashboard: boolean
    date: string,
    url: string,
    size: string,
    loading: boolean,
    target: string,
    user: any
}

export interface ISubscribeComp {
    display: string
}

export interface IPanelBoxProps {
    title: string,
    type: string,
    display: string, 
    show: boolean, 
    close: any, 
    animate: boolean, 
    data: any,
    size: string
}

export interface ICampaignSection {
    label: string,
    caption: string,
    thumbnail: string,
    body: string,
    url: string,
    color: string,
    footnote: string,
    ePreview: string,
    eValue: string,
    eRef: any
}

export interface ICGraphData {
    week: string,
    start: string,
    end: string,
    value: number,
    total: number,
    dates: Array<string>
}

export interface ICourseOverview {
    users: {
        total: number,
        admins: number,
        teachers: number,
        mentors: number,
        writers: number,
        students: number,
        businesses: number,
    },
    categories: {
        total: number,
        enabled: number,
        disabled: number
    },
    courses: {
        total: number,
        enabled: number,
        disabled: number,
        graph: Array<ICGraphData>
    },
    concepts: {
        total: number,
        enabled: number,
        disabled: number
    },
    quizzes: {
        total: number,
        enabled: number,
        disabled: number
    },
    fields: {
        total: number,
        enabled: number,
        disabled: number
    },
    lessons: {
        total: number,
        enabled: number,
        disabled: number,
        graph: Array<ICGraphData>
    },
    modules: {
        total: number,
        enabled: number,
        disabled: number,
        graph: Array<ICGraphData>
    },
    programs: {
        total: number,
        enabled: number,
        disabled: number,
        level: {
            novice: number,
            beginner: number,
            intermidiate: number,
            advanced: number,
            professional: number,
        },
        graph: Array<ICGraphData>
    },
    schools: {
        total: number,
        enabled: number,
        disabled: number,
    },
    sessions: {
        total: number,
        active: any,
    },
    students: {
        total: number,
        free: number,
        paid: number,
        program: number,
        mentorship: number,
        graph: Array<ICGraphData>
    },
    transactions: {
        total: number,
        failed: number,
        successful: number,
        graph: Array<ICGraphData>
    },
}

export interface IUpdateModal extends IModalProps{
    data: any,
    type: string
}

export interface ISeedData{
    modules: Array<{
        id: string,
        title: string,
        value: number,
        lessons: Array<{
            id: string,
            title: string,
            value: number,
            isEnabled: boolean
        }>,
        isEnabled: boolean
    }>,
    lessons: Array<{
        id: string,
        title: string,
        value: number,
        isEnabled: boolean
    }>,
    levels: Array<{
        id: string,
        name: string,
        label: string,
        courses: Array<{
            id: string,
            title: string,
            level: number,
            isEnabled: boolean
        }>
        isEnabled: boolean
    }>,
    courses: Array<{
        id: string,
        title: string,
        level: number,
        isEnabled: boolean
    }>
}

export interface IAudioHelper{
    progressBar: any,
    audioPlayer: any,
    progressCont: any,
    audioDuration: number | string,
    audioCurrentTime: number | string,
    audioId: string,
    playAudio(id: string): void,
    pauseAudio(id: string): void,
    muteAudio(id: string): void,
    unmuteAudio(id: string): void,
    getSeek(id: string): void,
    getSeekBar(id: string): void,
    getAudio(id: string, index: number): void,
    updateProgress(e: any): void,
    setProgress(e: any): void,
    initProgress(audioId: string): void,
    getDuration(meta: any): string | number;
    convertDuration(tm: any): string | number,
    convertTime(tm: any): string | number,
}

export interface IVideoHelper{
    duration: string | number,
    playVideo(id: string): void,
    pauseVideo(id: string): void,
    muteVideo(id: string): void,
    unmuteVideo(id: string): void,
    changeView(id: string): void
    seekVideo(id: string, barId: string, timeId: string): void,
    timeUpdate(id: string, barId: string, timeId: string): void,
    getDuration(id: string, timeId: string): string,
    setVolume(id: string, rid: string): void,
    seekProgress(id: string, barId: string, seekId: string): void
}

export interface IVideoControls {
    videoId: string, 
    volumeId: string, 
    timeId: string, 
    barId: string, 
    seekId: string,
    play: boolean,
    expand: boolean,
    playPause(e: any, id: string): void,
    expandView(e: any): void
}

export interface IOverControls {
    videoId: string,
    play: boolean,
    plaux: boolean,
    type: string,
    audioName: string,
    index: number,
    playPause(e: any, id: string): void,
    playAudio(e: any, id: string, index: number): void
}

export interface IAudioControls {
    name: string,
    play: boolean,
    muted: boolean,
    source: string,
    index: number,
    expand: boolean,
    playPause(e: any, id: string, index: number): void,
    muteToggle(e: any, id: string): void
    expandView(e: any): void
}

export interface IFunctionHelper {
    reposition(data: Array<any>, from: number, to: number): Array<any>
}

export interface ISearchProps {
    type: string,
    key: string,
    error: boolean,
    message: string,
    data: Array<any>
}