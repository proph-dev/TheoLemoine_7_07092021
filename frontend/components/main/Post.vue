<template>
    <section class="bg-white shadow-md my-8 rounded-xl overflow-hidden">
        <!-- post author -->
        <PostAuthor :messageId="messageId" :firstName="firstName" :lastName="lastName" :isAdmin="isAdmin" :createdAt="createdAt" />

        <!-- post content -->
        <PostContent :content="content" :attachment="attachment" />

        <!-- post reaction -->
        <PostReaction />

        <!-- post comments -->
        

        <!-- add a comment -->
        <AddComment />
    </section>
</template>

<script>
    import PostAuthor from '~/components/main/PostAuthor.vue';
    import PostContent from '~/components/main/PostContent.vue';
    import PostReaction from '~/components/main/PostReaction.vue';
    import PostComments from '~/components/main/PostComments.vue';
    import AddComment from '~/components/main/AddComment.vue';

    export default {
        components: {
            PostAuthor,
            PostContent,
            PostReaction,
            PostComments,
            AddComment
        },
        props: {
            messageId: Number,
            content: String,
            attachment: String,
            firstName: String,
            lastName: String,
            isAdmin: Boolean,
            createdAt: String,
        }
    }
</script>